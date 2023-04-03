import { atom } from 'recoil';
import { UserTracks } from '../interfaces';

const UserTrackAtom = atom({
  key: 'userTrackAtom',
  default: [] as UserTracks[],
});

export default UserTrackAtom;
