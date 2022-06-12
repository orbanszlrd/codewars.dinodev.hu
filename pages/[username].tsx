import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Layout from '../components/layout';

import {
  CodewarsKata,
  CompletedKatasResponse,
  UserResponse,
} from '../types/codewars';

import styles from '../styles/Home.module.scss';
import Date from '../components/date';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBan, FaInfoCircle } from 'react-icons/fa';
import Filter from '../components/filter';

type KataDetails = {
  [key: string]: {
    rank: {
      name: string;
      color: string;
      score: number;
    };
  };
};

const Home: NextPage = ({
  user,
  completedKatas,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [username, setUsername] = useState(user.username);
  const [katas, setKatas] = useState(completedKatas.data);
  const [kataDetails, setKataDetails] = useState({} as KataDetails);
  const [showRanks, setShowRanks] = useState(false);
  const [filter, setFilter] = useState('');

  const colors: { [key: string]: string } = {
    white: 'whitesmoke',
    yellow: '#ecb613',
    blue: '#1f87e7',
    purple: '#866cc7',
  };

  useEffect(() => {
    setKatas(
      completedKatas && completedKatas.data
        ? completedKatas.data.filter(
            (kata: CodewarsKata) =>
              kata.name.toLowerCase().includes(filter.toLowerCase()) ||
              kata.completedLanguages
                .join(', ')
                .toLowerCase()
                .includes(filter.toLowerCase())
          )
        : []
    );
  }, [completedKatas, filter]);

  const getKataDetails = (id: string) => {
    const url = `https://www.codewars.com/api/v1/code-challenges/${id}`;

    fetch(url)
      .then((result) => result.json())
      .then((result) =>
        setKataDetails({ ...kataDetails, [result.id]: result })
      );
  };

  const formatLeaderBoardPosition = () => {
    return user.leaderboardPosition
      ? user.leaderboardPosition.toLocaleString('en-US')
      : '';
  };

  const rankDialog = () => {
    const languages: {
      string: { name: string; score: number; color: string };
    } = user.ranks.languages;

    return (
      <div
        className={styles.ranks}
        style={{ display: showRanks ? 'block' : 'none' }}
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
    );
  };

  const toggleRanks = () => {
    setShowRanks(!showRanks);
  };

  return (
    <Layout>
      <Head>
        <title>Codewars</title>
        <meta name="description" content="Codewars" />
      </Head>

      <div className={styles.container}>
        <div className={styles['search-container']}>
          <input
            type="search"
            placeholder="username"
            value={username}
            onChange={(event) => setUsername(event?.target.value)}
          />
          <Link href={`/${username}`}>
            <a className={styles.button}>Search</a>
          </Link>
        </div>
        <h3>Codewars</h3>
        {user.username ? (
          <>
            <div className={styles['user-container']}>
              <div className={styles.badge}>
                <a
                  href={`https://www.codewars.com/users/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={`https://www.codewars.com/users/${user.username}/badges/large`}
                    alt="Codewars badge"
                    width={400}
                    height={40}
                  />
                </a>

                {rankDialog()}
              </div>
              <div>
                Name: {user.name}{' '}
                <a
                  title="Toggle Ranks"
                  onClick={() => toggleRanks()}
                  style={{ marginLeft: '.5rem', cursor: 'pointer' }}
                >
                  <FaInfoCircle />
                </a>
              </div>
              <div>Clan: {user.clan}</div>
              <div>Leaderboard position: #{formatLeaderBoardPosition()}</div>
              <div>Completed Katas: {user.codeChallenges.totalCompleted}</div>
            </div>

            <div className={styles['filter-container']}>
              <Filter
                placeholder="Filter"
                filter={filter}
                setFilter={setFilter}
              />
            </div>

            <div className={styles['grid-container']}>
              {katas.map((item: CodewarsKata, index: number) => (
                <article key={item.id}>
                  <h5 title={item.name}>
                    {item.name.length > 30
                      ? item.name.substring(0, 27) + '...'
                      : item.name}

                    <span
                      style={{
                        color: colors[kataDetails[item.id]?.rank.color],
                      }}
                      onClick={() => getKataDetails(item.id)}
                    >
                      {kataDetails && kataDetails[item.id]
                        ? kataDetails[item.id].rank.name
                        : '? kyu'}
                    </span>

                    <small>{katas.length - index}</small>
                  </h5>

                  <div>
                    <span>Completed languages: </span>
                    <b>{item.completedLanguages.join(', ')}</b>
                  </div>
                  <div>
                    <span>Completed At: </span>
                    <Date dateString={item.completedAt} />
                  </div>
                  <div className={styles['button-container']}>
                    <a
                      className={styles.button}
                      href={`https://www.codewars.com/kata/${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className={styles['user-container']}>
            <div className={styles.error}>
              <span>
                <FaBan />
              </span>
              <span>No user with the given username</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apiUrl = 'https://www.codewars.com/api/v1/users/';
  const username = context.params?.username;

  let result;

  const userUrl = `${apiUrl}${username}`;
  result = await fetch(userUrl);
  const user: UserResponse = await result.json();

  let katasUrl = `${apiUrl}${username}/code-challenges/completed`;
  result = await fetch(katasUrl);
  const completedKatas: CompletedKatasResponse = await result.json();

  let page = 1;

  while (page < completedKatas.totalPages) {
    katasUrl = `${apiUrl}${username}/code-challenges/completed?page=${page++}`;
    result = await fetch(katasUrl);

    const nextPage = await result.json();

    completedKatas.data = [...completedKatas.data, ...nextPage.data];
  }

  return {
    props: {
      user,
      completedKatas,
    },
  };
};
