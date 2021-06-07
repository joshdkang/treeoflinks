import React, { useState, useEffect } from 'react';
import validator from 'validator';
import { useParams } from 'react-router-dom'
import axios from 'axios';

const LinksPage = () => {
  const [tree, setTree] = useState(undefined);
  const [avatar, setAvatar] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const response = await axios.get(`https://treeoflinks.herokuapp.com/account/avatar/${username}`, { responseType: 'arraybuffer' });
        let buffer = Buffer.from(response.data, 'binary').toString('base64');

        if(!buffer) {
          setAvatar(undefined);
          return;
        }

        buffer = 'data:image/jpeg;base64,' + buffer;
        setAvatar(buffer);
      } catch (err) {
        console.log(err);
      }
    }

    const getTree = async () => {
      try {
        const response = await axios.get(`https://treeoflinks.herokuapp.com/${username}`);
        setTree(response.data);
      } catch (err) {
        console.log (err);
      }
    }

    (async function() {
      await getTree();
      await getAvatar();
      setLoading(false);
    })();
  }, [username]);

  const addhttp = (url) => {
    if (!/^(?:f|ht)tps?:\/\//.test(url)) url = "http://" + url;
    return url;
  }

  const renderLink = (link) => {
    if  (!link || !validator.isURL(link.url) || !link.title) return 
    return (
      <div key={link._id}>
        <a href={addhttp(link.url)} target="_blank" rel="noreferrer"  >
          <button 
            className = "ui fluid big inverted blue button"
            style={{ marginTop: '10px' }}
            href={link.url}
          >
            {link.title}
          </button>
        </a> 
      </div>
    );
  }

  const renderAvatar = () => {
    if (!Array.isArray(tree) && !loading)
      return renderError();

    if (!avatar && !loading)
      return (
        <i className="massive user circle icon"></i>
      );
      
    if (avatar)
      return (
        <img src={avatar} alt='avatar' />
      ); 
  }

  const renderName = () => {
    if (Array.isArray(tree)) {
      return (
        <h3 style={{ marginBottom: '20px' }}>@{username}</h3>
      );
    }
  }

  const renderTree =  () => {
    try {
      if(tree && Array.isArray(tree)) return tree.map(link => renderLink(link))
    } catch (err) {
      console.log(err);
    }
  }

  const renderError = () => {
    return (
      <div className="ui center aligned three column grid" style={{ marginTop: '10px' }}>
          <h3>The page you are looking for does not exist.</h3>
      </div>
    )
  }

  return (
    <div className="ui center aligned three column grid" style={{ marginTop: '10px' }}>
      <div className="ui column">
        {renderAvatar()}
        {renderName()}
        {renderTree()}
      </div>
    </div>
  );
}

export default LinksPage;