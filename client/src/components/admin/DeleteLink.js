import React from 'react';
import axios from 'axios'

const DeleteLink = ({loading, setLoading, fields, index}) => {
  const deleteLink = async () => {
    const deletedLink = { _id : fields.value[index]._id }
    setLoading(true);
    try {
      await axios.delete('https://treeoflinks.herokuapp.com/admin/link', { data: deletedLink });
      fields.remove(index)
    } catch(error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <button 
      className="ui right floated icon button"
      type="button"
      onClick={() => { deleteLink() }}
      disabled={loading}
    >
      <i className="trash alternate outline icon"></i>
    </button>
  );
}

export default DeleteLink;