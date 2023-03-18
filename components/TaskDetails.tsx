import { Details } from '../interfaces';

type Props = {
  markDone: boolean;
  setMarkDone: (markDone: boolean) => void;
  details: Array<Details>;
};

const TaskDetails = ({ markDone, setMarkDone, details }: Props) => {
  const handleCompleteTask = () => {
    setMarkDone(true);
  };
  return (
    <div className='flex justify-between px-5 py-3 bg-[#393053] text-white'>
      <div className='w-full'>
        <div className='text-sm'>
          <div className='flex flex-col'>
            {details.map((detail, index) => (
              <a className='p-2' href={detail.link} key={index} target='_blank'>
                {index + 1}. {detail.title}
              </a>
            ))}
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            className='bg-green-700 px-5 py-2 rounded-lg text-sm'
            onClick={handleCompleteTask}
          >
            {markDone ? 'Completed' : 'Mark as Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
