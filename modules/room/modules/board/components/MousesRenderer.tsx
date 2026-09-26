import { useRoom } from '@/common/state/room';

import UserMouse from './UserMouse';

const MousesRenderer = () => {
  const { users } = useRoom();

  return (
    <>
      {[...users.keys()].map((userId) => (
        <UserMouse userId={userId} key={userId} />
      ))}
    </>
  );
};

export default MousesRenderer;
