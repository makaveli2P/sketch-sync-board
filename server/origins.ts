// Parses the CLIENT_ORIGIN setting: a comma-separated list of origins that
// can connect. A "*" matches one part of a host name, for example
// "https://my-app-*.vercel.app" matches every Vercel preview URL of my-app.
const WILDCARD = '*';

const escapeRegExp = (text: string) => text.replace(/[.+?^${}()|[\]\\/-]/g, '\\$&');

export const parseOrigins = (setting: string | undefined): (string | RegExp)[] =>
  (setting ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean)
    .map((origin) =>
      origin.includes(WILDCARD)
        ? new RegExp(`^${origin.split(WILDCARD).map(escapeRegExp).join('[a-z0-9-]+')}$`)
        : origin,
    );
