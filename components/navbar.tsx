import Link from 'next/link';
import { FunctionComponent } from 'react';
import {
  FaCode,
  FaGithub,
  FaHome,
  FaImages,
  FaInfoCircle,
} from 'react-icons/fa';

import styles from './navbar.module.scss';

const Navbar: FunctionComponent = () => {
  return <nav className={styles.nav}></nav>;
};

export default Navbar;
