import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LinkList from './LinkList';

const Links = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLinks = async () => {
    const linksResponse = await axios.post('https://treeoflinks.herokuapp.com/admin');
    setLinks(linksResponse.data);
  }

  useEffect(() => {
    (async function() {
      await getLinks();
    })();
  }, []);

  return (
    <div className="ui center aligned three column grid" >
      <div className="column">
        <LinkList links={links} setLinks={setLinks} getLinks={getLinks} loading={loading} setLoading={setLoading} />
      </div>
    </div>
  );
}

export default Links;