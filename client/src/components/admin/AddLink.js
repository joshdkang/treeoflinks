import React from 'react';
import axios from 'axios'

const AddLink = ({loading, setLoading, fields}) => {
  const createNewLink = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://treeoflinks.herokuapp.com/admin/link');
      fields.unshift2(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <div style={{marginBottom: '12px'}}>
      <button 
        type="button"
        className="ui blue large button"
        disabled={loading}
        onClick={() => createNewLink()}
      >
        Add New Link
      </button>
    </div>
  );
}

export default AddLink;