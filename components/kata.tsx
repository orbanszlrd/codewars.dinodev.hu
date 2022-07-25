import { FunctionComponent } from 'react';
import { CodewarsKata } from '../types/codewars';
import Date from './date';
import styles from './kata.module.scss';

export interface KataProps {
  kata: CodewarsKata;
  color: string | undefined;
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
            color: color,
          }}
          onClick={() => getKataDetails(kata.id)}
        >
          {rank ?? '? kyu'}
        </span>
        <h5>{kata.name}</h5>
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
