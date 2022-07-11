import { FunctionComponent } from "react";
import { FaBan } from "react-icons/fa";

import styles from './no-user.module.scss';

const NoUser : FunctionComponent = function() {
    return (
        <div className={styles['no-user-container']}>
          <span>
            <FaBan />
          </span>
          <span>No user with the given username</span>
      </div>
);
}

export default NoUser;