import { useEffect, useState } from 'react';
import { TiTick } from 'react-icons/ti';
import { ImSpinner4 } from 'react-icons/im';
import useGetCompletedTasks from '../hooks/useGetCompletedTasks';

type Props = {
  taskName: string;
  children: React.ReactNode;
  index: number;
  trackId: string;
  taskId: string;
};

const Collapsible = (props: Props) => {
  const [markDone, setMarkDone] = useState(false);
  const [open, setOPen] = useState(false);

  const completedTasks = useGetCompletedTasks(props.trackId);

  useEffect(() => {
    completedTasks.map((task) => {
      if (task.id === props.taskId) {
        setMarkDone(true);
      }
    });
  }, [completedTasks]);

  const toggle = () => {
    setOPen(!open);
  };

  return (
    <div className='border-b-[1px] border-[#b4b4b4]'>
      <button
        className={
          markDone
            ? 'bg-gray-900 flex p-4 w-full justify-between font-normal text-lg text-white border-b-[1px] border-gray-800'
            : 'bg-gray-800 flex p-4 w-full justify-between font-normal text-lg text-white border-b-[1px] border-gray-900'
        }
        onClick={toggle}
      >
        {markDone ? <TiTick /> : <ImSpinner4 />}
        <h3>{props.taskName}</h3>
        <span className='text-xl'>{!open ? '+' : '-'}</span>
      </button>
      {open && <div>{props.children}</div>}
    </div>
  );
};

export default Collapsible;
