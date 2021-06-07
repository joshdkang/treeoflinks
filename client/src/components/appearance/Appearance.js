import React, { useState, useEffect, useContext }  from 'react';
import AvatarComponent from './AvatarComponent';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const Appearance = () => {
  const [avatar, setAvatar] = useState(undefined);
  const [changeAvatar, setChangeAvatar] = useState(false);
  const [loading, setLoading] = useState(true);
  const {username} = useContext(AuthContext);

  const bufferToB64 = (data) => {
    let buffer = Buffer.from(data, 'binary').toString('base64');
    if (!buffer) {
      setAvatar(undefined);
      return;
    }
    buffer = 'data:image/jpeg;base64,' + buffer;
    return buffer;
  }

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const response = await axios.get(`https://treeoflinks.herokuapp.com/account/avatar/${username}`, { responseType: 'arraybuffer' });
        setAvatar(bufferToB64(response.data));
      } catch (err) {
        console.log(err);
      }
    }

    (async function() {
      setLoading(true);
      await getAvatar();
      setLoading(false);
    })();
  }, [username, changeAvatar]);

  return (
    <div>
      <AvatarComponent avatar={avatar} setAvatar={setAvatar} changeAvatar={changeAvatar} setChangeAvatar={setChangeAvatar} loading={loading} />
    </div>
  );
}

export default Appearance;