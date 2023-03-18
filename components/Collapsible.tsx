import { useState } from 'react';

type Props = {
  taskName: string;
  children: React.ReactNode;
  index: number;
  markDone: boolean;
};

const Collapsible = (props: Props) => {
  const [open, setOPen] = useState(false);

  const toggle = () => {
    setOPen(!open);
  };

  return (
    <div className='border-b-[1px] border-[#b4b4b4]'>
      <button
        className={
          props.markDone
            ? 'bg-[#443C68] flex p-4 w-full justify-between font-normal text-lg text-white'
            : 'bg-[#393053] flex p-4 w-full justify-between font-normal text-lg text-white'
        }
        onClick={toggle}
      >
        <span className='text-[#b4b4b4]'>Day {props.index + 1}</span>
        <h3>{props.taskName}</h3>
        <span className='text-xl'>{!open ? '+' : '-'}</span>
      </button>
      {open && <div>{props.children}</div>}
    </div>
  );
};

export default Collapsible;
