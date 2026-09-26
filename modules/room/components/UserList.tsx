import { useRoom } from '@/common/state/room';

const UserList = () => {
  const { users } = useRoom();

  return (
    <div className="pointer-events-none absolute z-30 flex p-5">
      {[...users].map(([userId, user], index) => (
        <div
          key={userId}
          title={user.name}
          className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white select-none md:h-8 md:w-8 md:text-base lg:h-12 lg:w-12"
          style={{
            backgroundColor: user.color || 'black',
            marginLeft: index !== 0 ? '-0.5rem' : 0,
          }}
        >
          {user.name.charAt(0).toUpperCase() || 'A'}
        </div>
      ))}
    </div>
  );
};

export default UserList;
