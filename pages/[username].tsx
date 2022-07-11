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
  KataDetails,
  UserResponse,
} from '../types/codewars';

import styles from '../styles/Home.module.scss';
import React, { KeyboardEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Filter from '../components/filter';
import RankDialog from '../components/rank-dialog';
import User from '../components/user';
import Kata from '../components/kata';
import NoUser from '../components/no-user';
import { useRouter } from 'next/router';

const Home: NextPage = ({
  user,
  completedKatas,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const [username, setUsername] = useState(user.username);
  const [katas, setKatas] = useState(completedKatas.data);
  const [kataDetails, setKataDetails] = useState({} as KataDetails);
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

  const searchUser = (event: KeyboardEvent<HTMLInputElement>) =>  {
    if (event.key === 'Enter') {
      router.push(`/${event.currentTarget.value}`);
    }
;  }

  return (
    <Layout>
      <Head>
        <title>Codewars Progress</title>
        <meta name="description" content="Codewars" />
      </Head>

      <div className={styles.container}>
        <div className={styles['search-container']}>
          <input
            type="search"
            placeholder="username"
            value={username}
            onChange={(event) => setUsername(event?.target.value)}
            onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => searchUser(event)}
          />
          <Link href={`/${username}`}>
            <a className={styles.button}>Search</a>
          </Link>
        </div>
        <h3>Codewars Progress</h3>
        {user.username ? (
          <>
            <div className={styles['user-container']}>
              <RankDialog user={user} colors={colors} />
              <User user={user} />
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
                  <Kata
                    key={index}
                    kata={item}
                    color={colors[kataDetails[item.id]?.rank.color]}
                    rank={kataDetails[item.id]?.rank.name}
                    nr={katas.length - index}
                    getKataDetails={getKataDetails}
                  />
              ))}
            </div>
          </>
        ) : <NoUser />
        }
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

    const nextPage: CompletedKatasResponse = await result.json();

    completedKatas.data = [...completedKatas.data, ...nextPage.data];
  }

  completedKatas.data && completedKatas.data.forEach(kata => {
    if (kata.name === undefined) {
      kata.name =  '[Unknown]';
    }
  });

  return {
    props: {
      user,
      completedKatas,
    },
  };
};
