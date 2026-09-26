import { expect, test, type Page, type WebSocketRoute } from '@playwright/test';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Counts the pixels with ink in an area of the board canvas (board coordinates).
const inkIn = (page: Page, area: Area) =>
  page.getByTestId('board').evaluate((canvas, { x, y, width, height }) => {
    const ctx = (canvas as HTMLCanvasElement).getContext('2d')!;
    const { data } = ctx.getImageData(x, y, width, height);
    let count = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) count += 1;
    return count;
  }, area);

const drawLine = async (page: Page, from: [number, number], to: [number, number]) => {
  await page.mouse.move(...from);
  await page.mouse.down();
  await page.mouse.move(...to, { steps: 10 });
  await page.mouse.up();
};

const openHome = async (page: Page, name: string) => {
  await page.goto('/');
  await page.getByLabel('Enter Your Name:').fill(name);
  await expect(page.getByRole('button', { name: 'Create' })).toBeEnabled();
};

const createRoom = async (page: Page, name: string) => {
  await openHome(page, name);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(/\/[a-z0-9]{4}$/);
  await expect(page.getByTestId('board')).toBeVisible();
  return new URL(page.url()).pathname.slice(1);
};

const joinByLink = async (page: Page, roomId: string, name: string) => {
  await page.goto(`/${roomId}`);
  await page.getByLabel('Enter Your Name:').fill(name);
  await page.getByRole('button', { name: 'Enter Room' }).click();
  await expect(page.getByTestId('board')).toBeVisible();
};

const blur = (page: Page) =>
  page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());

const LINE_1: Area = { x: 600, y: 390, width: 200, height: 20 };
const LINE_2: Area = { x: 600, y: 490, width: 200, height: 20 };

test('two users draw, undo and chat together', async ({ browser }) => {
  const alice = await (await browser.newContext()).newPage();
  const bob = await (await browser.newContext()).newPage();

  const roomId = await createRoom(alice, 'Alice');
  await joinByLink(bob, roomId, 'Bob');
  await expect(alice.getByText('Bob has joined the room.')).toBeVisible();

  await drawLine(alice, [600, 400], [800, 400]);
  await expect.poll(() => inkIn(bob, LINE_1)).toBeGreaterThan(100);

  await drawLine(bob, [600, 500], [800, 500]);
  await expect.poll(() => inkIn(alice, LINE_2)).toBeGreaterThan(100);

  // Ctrl+Z in the chat input must not undo the drawing.
  await alice.getByRole('button', { name: 'Chat' }).click();
  await alice.getByLabel('Message').click();
  await alice.keyboard.press('Control+z');
  await alice.keyboard.press('Delete');
  await alice.waitForTimeout(500);
  expect(await inkIn(bob, LINE_1)).toBeGreaterThan(100);

  await alice.getByLabel('Message').fill('hello from alice');
  await alice.keyboard.press('Enter');
  await expect(bob.getByText('hello from alice').first()).toBeVisible();

  // Ctrl+Z on the board undoes Alice's line for Bob, and Bob's line stays.
  await blur(alice);
  await alice.keyboard.press('Control+z');
  await expect.poll(() => inkIn(bob, LINE_1)).toBe(0);
  expect(await inkIn(bob, LINE_2)).toBeGreaterThan(100);

  // Redo draws it again.
  await alice.keyboard.press('Control+y');
  await expect.poll(() => inkIn(bob, LINE_1)).toBeGreaterThan(100);
});

test('delete erases exactly the selected area', async ({ page }) => {
  await createRoom(page, 'Alice');
  await drawLine(page, [550, 400], [850, 400]);
  await drawLine(page, [600, 430], [800, 430]);
  await expect
    .poll(() => inkIn(page, { x: 550, y: 420, width: 300, height: 20 }))
    .toBeGreaterThan(0);

  await page.getByRole('button', { name: 'Select' }).click();
  await drawLine(page, [600, 385], [800, 415]);
  await expect(page.getByLabel('Delete the selection')).toBeVisible();

  await page.keyboard.press('Delete');
  await expect(page.getByLabel('Delete the selection')).toBeHidden();

  // Inside the selection: no ink, and no outline of the old content.
  await expect.poll(() => inkIn(page, { x: 600, y: 385, width: 200, height: 30 })).toBe(0);
  // Just outside the selection: the ink stays.
  expect(await inkIn(page, { x: 590, y: 395, width: 8, height: 10 })).toBeGreaterThan(0);
  expect(await inkIn(page, { x: 802, y: 395, width: 8, height: 10 })).toBeGreaterThan(0);
  // The line below the selection stays.
  expect(await inkIn(page, { x: 600, y: 425, width: 200, height: 10 })).toBeGreaterThan(0);
});

test('move places the selection at the right spot on a moved board', async ({ page }) => {
  await createRoom(page, 'Alice');
  await drawLine(page, [600, 400], [800, 400]);
  await expect.poll(() => inkIn(page, LINE_1)).toBeGreaterThan(0);

  // Move the board 200 px to the left with the right mouse button.
  await page.mouse.move(900, 600);
  await page.mouse.down({ button: 'right' });
  await page.mouse.move(700, 600, { steps: 10 });
  await page.mouse.up({ button: 'right' });
  const box = await page.getByTestId('board').boundingBox();
  expect(Math.round(box!.x)).toBe(-200);

  // The line is now at screen x 400 to 600.
  await page.getByRole('button', { name: 'Select' }).click();
  await drawLine(page, [390, 385], [610, 415]);
  await page.getByLabel('Move the selection').click();

  const preview = page.getByAltText('The image to place');
  await expect(preview).toBeVisible();
  const previewBox = await preview.boundingBox();
  expect(Math.abs(previewBox!.x - 390)).toBeLessThanOrEqual(2);
  expect(Math.abs(previewBox!.y - 385)).toBeLessThanOrEqual(2);

  // A cancel keeps the original content.
  await page.getByLabel('Cancel').click();
  await expect(preview).toBeHidden();
  await page.waitForTimeout(300);
  expect(await inkIn(page, LINE_1)).toBeGreaterThan(100);

  // Move it 100 px down: the old area is empty, and the line is at the new place.
  await page.getByRole('button', { name: 'Select' }).click();
  await drawLine(page, [390, 385], [610, 415]);
  await page.getByLabel('Move the selection').click();
  await expect(preview).toBeVisible();
  const start = (await preview.boundingBox())!;
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2 + 100, { steps: 10 });
  await page.mouse.up();
  // The drag has a little momentum. Let it finish, then check that the image stopped.
  await page.waitForTimeout(800);
  const end = (await preview.boundingBox())!;
  await page.waitForTimeout(200);
  expect(await preview.boundingBox()).toEqual(end);
  const dx = Math.round(end.x - start.x);
  const dy = Math.round(end.y - start.y);
  expect(dy).toBeGreaterThanOrEqual(90);
  await page.getByLabel('Place the image').click();

  await expect.poll(() => inkIn(page, LINE_1)).toBe(0);
  await expect
    .poll(() => inkIn(page, { ...LINE_1, x: LINE_1.x + dx, y: LINE_1.y + dy }))
    .toBeGreaterThan(100);
});

test('the room page joins the room again after the connection drops', async ({ browser }) => {
  const alice = await (await browser.newContext()).newPage();
  const bob = await (await browser.newContext()).newPage();

  const bobSockets: WebSocketRoute[] = [];
  await bob.routeWebSocket(/\/socket\.io\//, (ws) => {
    bobSockets.push(ws);
    ws.connectToServer();
  });

  const roomId = await createRoom(alice, 'Alice');
  await joinByLink(bob, roomId, 'Bob');
  await expect(alice.getByText('Bob has joined the room.')).toBeVisible();
  await expect.poll(() => bobSockets.length).toBeGreaterThan(0);

  await bobSockets.at(-1)!.close();
  await expect(bob.getByText('The connection was lost. Reconnecting…')).toBeVisible();
  await expect(bob.getByText('The connection was lost. Reconnecting…')).toBeHidden({
    timeout: 15_000,
  });

  // After the rejoin, moves go both ways again.
  await drawLine(alice, [600, 400], [800, 400]);
  await expect.poll(() => inkIn(bob, LINE_1)).toBeGreaterThan(100);
  await drawLine(bob, [600, 500], [800, 500]);
  await expect.poll(() => inkIn(alice, LINE_2)).toBeGreaterThan(100);
});

test('an undo right after a stroke undoes that stroke for everyone', async ({ browser }) => {
  const alice = await (await browser.newContext()).newPage();
  const bob = await (await browser.newContext()).newPage();

  // Make the messages from the server to Alice slow when `delayMs` is set.
  let delayMs = 0;
  await alice.routeWebSocket(/\/socket\.io\//, (ws) => {
    const server = ws.connectToServer();
    server.onMessage((message) => {
      if (delayMs) setTimeout(() => ws.send(message), delayMs);
      else ws.send(message);
    });
    ws.onMessage((message) => server.send(message));
  });

  const roomId = await createRoom(alice, 'Alice');
  await joinByLink(bob, roomId, 'Bob');
  await expect(alice.getByText('Bob has joined the room.')).toBeVisible();

  await drawLine(alice, [600, 400], [800, 400]);
  await expect.poll(() => inkIn(bob, LINE_1)).toBeGreaterThan(100);

  // The server confirms the second stroke only after the undo.
  delayMs = 400;
  await drawLine(alice, [600, 500], [800, 500]);
  await alice.keyboard.press('Control+z');
  delayMs = 0;

  // Both users see the first stroke and not the second.
  await expect.poll(() => inkIn(bob, LINE_2), { timeout: 5000 }).toBe(0);
  await expect.poll(() => inkIn(alice, LINE_2), { timeout: 5000 }).toBe(0);
  expect(await inkIn(bob, LINE_1)).toBeGreaterThan(100);
  expect(await inkIn(alice, LINE_1)).toBeGreaterThan(100);
});

test('the board is read-only while the connection is lost', async ({ browser }) => {
  const alice = await (await browser.newContext()).newPage();
  const bob = await (await browser.newContext()).newPage();

  let offline = false;
  const bobSockets: WebSocketRoute[] = [];
  await bob.routeWebSocket(/\/socket\.io\//, (ws) => {
    if (offline) {
      ws.close();
      return;
    }
    bobSockets.push(ws);
    ws.connectToServer();
  });
  // Socket.IO also tries HTTP long polling.
  await bob.route('**/socket.io/**', (route) => (offline ? route.abort() : route.continue()));

  const roomId = await createRoom(alice, 'Alice');
  await joinByLink(bob, roomId, 'Bob');
  await drawLine(bob, [600, 400], [800, 400]);
  await expect.poll(() => inkIn(alice, LINE_1)).toBeGreaterThan(100);

  offline = true;
  await bobSockets.at(-1)!.close();
  await expect(bob.getByText('The connection was lost. Reconnecting…')).toBeVisible();
  await expect(bob.getByRole('button', { name: 'Undo' })).toBeDisabled();

  // Nothing happens: no stroke and no undo.
  await drawLine(bob, [600, 500], [800, 500]);
  await bob.keyboard.press('Control+z');
  expect(await inkIn(bob, LINE_2)).toBe(0);

  offline = false;
  await expect(bob.getByText('The connection was lost. Reconnecting…')).toBeHidden({
    timeout: 20_000,
  });

  // After the rejoin nothing arrived late, and the board works again.
  await alice.waitForTimeout(500);
  expect(await inkIn(alice, LINE_2)).toBe(0);
  expect(await inkIn(alice, LINE_1)).toBeGreaterThan(100);
  await drawLine(bob, [600, 500], [800, 500]);
  await expect.poll(() => inkIn(alice, LINE_2)).toBeGreaterThan(100);
});
