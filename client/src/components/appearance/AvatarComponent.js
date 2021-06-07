import React, { useState} from 'react';
import Avatar from 'react-avatar-edit';
import axios from 'axios';

const AvatarComponent = ({ avatar, setAvatar, changeAvatar, setChangeAvatar }) => {
  const [preview, setPreview] = useState(undefined);
  const [previewFileName, setPreviewFileName] = useState(undefined);

  const onClose = () => {
    setPreview(null);
  }

  const onCrop = (preview) => {
    setPreview(preview);
  }

  const onBeforeFileLoad = (e) => {
    if (e.target.files[0].size > 2000000) {
      alert("File size is too big (Max: 2 MB)");
      e.target.value = '';
      return;
    } 

    const avatarName = e.target.files[0].name;
    setPreviewFileName(avatarName);
  }

  // Converts base64 string to blob
  // dataURI assumed to include base64 prefix ('data:image/jpeg;base64,')
  // atob decodes base64-encoded string into a new string with a character for each byte of binary data
  // ArrayBuffer of byte values converted into real typed byte array by passing into Uint8Array constructor (creates view)
  // Each character's code point (charCode) is the value of each byte
  // Converted into Blob by wrapping in array and passing to Blob constructor
  function b64toBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) 
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ab], { type: 'image/png' });
}

  const submitAvatar = async () => {
    try {
      if (!preview) return;

      const previewBlob = b64toBlob(preview);
      let form = new FormData();
      form.append('avatar', previewBlob, previewFileName);
      await axios.post('https://treeoflinks.herokuapp.com/account/avatar', form);
      setChangeAvatar(!changeAvatar);
    } catch (e) {
      console.log(e);
    }
  }

  const deleteAvatar = async () => {
    if (!avatar) return;

    try {
      await axios.delete('https://treeoflinks.herokuapp.com/account/avatar');
      setAvatar(undefined);
    } catch (e) {
      console.log(e);
    }
  }

  const renderAvatar = () => {
    if (!avatar)
      return (
        <i className="massive user circle icon"></i>
      );
    return (
      <div>
        <img src={avatar} alt='avatar' />
      </div>
    ); 
  }

  return (
    <div className="ui center aligned three column grid" >
      <div className="column">
        <div className="ui clearing segment">
          <h2>Edit Avatar</h2>
          {renderAvatar()}
          <div 
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: '20px',
              marginTop: '20px'
            }}
          >
            <Avatar
              width={400}
              height={400}
              onCrop={onCrop}
              onClose={onClose}
              src={null}
              onBeforeFileLoad={onBeforeFileLoad}
              exportQuality={1.0}
            />  
          </div>
          <button 
            className="ui blue large button"
            onClick={submitAvatar}
          >
              Upload
          </button>
          <button 
            className="ui large button"
            onClick={deleteAvatar}
          >
              Delete
          </button>  
        </div>   
      </div>
    </div>
  );
};

export default AvatarComponent;