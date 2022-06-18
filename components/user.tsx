import { FunctionComponent } from 'react';
import { UserResponse } from '../types/codewars';
import styles from './user.module.scss';

export interface UserProps {
  user: UserResponse;
}

const User: FunctionComponent<UserProps> = ({ user }) => {
  const formatLeaderBoardPosition = () => {
    return user.leaderboardPosition
      ? user.leaderboardPosition.toLocaleString('en-US')
      : '';
  };

  return (
    <div className={styles.user}>
      <div>Name: {user.name}</div>
      <div>Clan: {user.clan}</div>
      <div>Honor: {user.honor.toLocaleString()}</div>
      <div>Leaderboard position: #{formatLeaderBoardPosition()}</div>
      <div>Completed Katas: {user.codeChallenges.totalCompleted}</div>
    </div>
  );
};

export default User;
