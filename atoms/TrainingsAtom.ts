import { atom } from 'recoil';
import { TrainingsInterface } from '../interfaces';

const TrainingAtom = atom({
  key: 'trainingAtom',
  default: [] as TrainingsInterface[],
});

export default TrainingAtom;
