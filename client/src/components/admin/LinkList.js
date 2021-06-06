import React from 'react';
import { Form, Field } from "react-final-form";
import arrayMutators from 'final-form-arrays'
import { FieldArray } from "react-final-form-arrays";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';
import validator from 'validator';
import AddLink from './AddLink';
import DeleteLink from './DeleteLink';

const grid = 2;

const validateLink = values => {
  if (values && !validator.isURL(values)) return 'Invalid url.';
}

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  padding: grid,
  width: "auto"
});

const LinkList = ({links, setLinks, loading, setLoading}) => {
  const initialLinks = { links };

  const saveLinks = async (values) => {
    try {
      await axios.patch('https://treeoflinks.herokuapp.com/admin', values.links);
    } catch(error) {
      console.log(error);
    }
  };

  const editLink = async (fields, index) => {
    try {
      await axios.patch('https://treeoflinks.herokuapp.com/admin/link', fields.links[index]);
    } catch(error) {
      console.log(error);
    }
  };

  const handleOnDragEnd = fields => async result => {
    if (!result.destination) {
      return;
    }
    setLoading(true);
    const updatedLinks = Array.from(fields.value);
    const [removed] = updatedLinks.splice(result.source.index, 1);
    updatedLinks.splice(result.destination.index, 0, removed);
    fields.value = updatedLinks;
    setLinks(updatedLinks);
    
    try {
      await axios.patch('https://treeoflinks.herokuapp.com/admin', updatedLinks);
    } catch(error) {
      console.log(error);
    }
    setLoading(false);
  };

  const renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className="ui small red message">
          <div className="content" align="left">{error}</div>
        </div>
      );
    }
  };
  
  const renderInput = ({ input, meta, placeholder }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
  
    return (
      <div className={className}>
        <input {...input} autoComplete="off" placeholder={placeholder} />
        {renderError(meta)}
      </div>
    )
  };

  const renderList = () => {
    return (
      <Form
        onSubmit={saveLinks}
        initialValues={initialLinks}
        mutators={{ 
          ...arrayMutators
        }}
        render={({ handleSubmit, dirty, values }) => { 
          return (   
            <div>
              <FieldArray name='links'>
                {({ fields }) => (
                  <DragDropContext onDragEnd={handleOnDragEnd(fields)}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                      <AddLink loading={loading} setLoading={setLoading} fields={fields} />
                        {fields.map((name, index) => (
                          <Draggable
                            key={name}
                            draggableId={name}
                            index={index}
                            isDragDisabled={loading}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <form 
                                  className="ui equal width form"
                                  onSubmit={handleSubmit}
                                  onBlur={() => { dirty && editLink(values, index) }}
                                >
                                  <div className="ui clearing segment">
                                    <Field
                                      name={`${name}.title`}
                                      component={renderInput}
                                      placeholder="Title"
                                    />
                                    <Field 
                                      name={`${name}.url`}
                                      component={renderInput}
                                      placeholder="Url"
                                      validate={validateLink}
                                    />
                                    <DeleteLink loading={loading} setLoading={setLoading} fields={fields} index={index} />
                                  </div>     
                                </form>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                )}
              </FieldArray>
            </div>
          );
        }}
      />
    );
  }

  return (
    <div>
      {renderList()}
    </div>
  );
}

export default LinkList;