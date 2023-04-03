import { atom } from 'recoil';
import { LeaderboardEntry } from '../interfaces';

const LeaderboardAtom = atom({
  key: 'leaderboardAtom',
  default: [] as LeaderboardEntry[],
});

export default LeaderboardAtom;
