import { atom } from 'recoil';
import { TrainingsInterface } from '../interfaces';

const userTrackDetailsState = atom({
  key: 'userTrackDetailsState',
  default: {} as TrainingsInterface,
});

export default userTrackDetailsState;
