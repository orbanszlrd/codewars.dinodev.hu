import { FunctionComponent } from 'react';
import { CodewarsKata } from '../types/codewars';
import Date from './date';
import styles from './kata.module.scss';

export interface KataProps {
  kata: CodewarsKata;
  color: string;
  rank: string;
  nr: number;
  getKataDetails: Function;
}

const Kata: FunctionComponent<KataProps> = ({
  kata,
  nr,
  color,
  rank,
  getKataDetails,
}) => {
  return (
    <article className={styles.kata}>
      <header>
        <span
          style={{
            color: color ? color : '',
          }}
          onClick={() => getKataDetails(kata.id)}
        >
          {rank ? rank : '? kyu'}
        </span>

        <h5 title={kata.name}>
          {kata.name.length > 300 ? kata.name.substring(0, 27) + '...' : kata.name}
        </h5>

        <small>{nr}</small>
      </header>

      <div>
        <span>Completed languages: </span>
        <b>{kata.completedLanguages.join(', ')}</b>
      </div>
      <div>
        <span>Completed At: </span>
        <Date dateString={kata.completedAt} />
      </div>
      <div className={styles['button-container']}>
        <a
          className={styles.button}
          href={`https://www.codewars.com/kata/${kata.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          Open
        </a>
      </div>
    </article>
  );
};

export default Kata;
