import { FunctionComponent, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { UserResponse } from '../types/codewars';
import styles from './rank-dialog.module.scss';

export interface RankDialogProps {
  colors: { [key: string]: string };
  user: UserResponse;
}

const RankDialog: FunctionComponent<RankDialogProps> = ({ user, colors }) => {
  const languages: {
    string: { name: string; score: number; color: string };
  } = user.ranks.languages;

  const [isOpen, setIsOpen] = useState(false);

  const toggleRanks = () => {
    setIsOpen(!isOpen);
  };

  const rankDialogToggler = () => {
    return isOpen ? <FaAngleUp /> : <FaAngleDown />;
  };

  return (
    <section className={styles.badge}>
      <a
        href={`https://www.codewars.com/users/${user.username}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: colors[user.ranks.overall.color] }}
      >
        <span>
          {`Rank: ${
            user.ranks.overall.name
          } (${user.ranks.overall.score.toLocaleString()})`}
        </span>
      </a>
      <span
        title="Toggle Ranks"
        onClick={() => toggleRanks()}
        style={{
          cursor: 'pointer',
          float: 'right',
        }}
      >
        {rankDialogToggler()}
      </span>

      <div
        className={styles.ranks}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {Object.entries(languages)
          .sort((a, b) => b[1].score - a[1].score)
          .map(([language, result]) => (
            <div key={language} style={{ color: colors[result.color] }}>
              <small>
                {language} : {result.name} ({result.score})
              </small>
            </div>
          ))}
      </div>
    </section>
  );
};

export default RankDialog;
