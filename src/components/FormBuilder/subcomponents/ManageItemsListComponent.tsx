import React, { FC, useEffect, useState } from 'react';
import { FormLayoutCoponentChildrenItemsType } from '../../../types/FormTemplateTypes';
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from '@mui/material';
import { Delete, Edit, CheckCircle } from '@mui/icons-material';
import { generateID } from '../../../utils/common';
import { Tooltip } from '@mui/material'
interface ManageItemsListComponentProps {
  items: FormLayoutCoponentChildrenItemsType[] | undefined;
  addItemInList: (item: FormLayoutCoponentChildrenItemsType) => void;
  deleteItemFromList: (item: FormLayoutCoponentChildrenItemsType) => void;
  editIteminList: (item: FormLayoutCoponentChildrenItemsType) => void;
}

const ManageItemsListComponent: FC<ManageItemsListComponentProps> = (props) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>('');
  const [editItemId, setEditItemId] = useState<string | undefined>(undefined);

  const { items, addItemInList, deleteItemFromList, editIteminList } = props;

  useEffect(() => {
    cancelEditing();
  }, [items]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setItemName(value);
  };

  const changeToEditMode = (item: FormLayoutCoponentChildrenItemsType) => {
    setItemName(item.label);
    setEditItemId(item.id);
    setEditMode(true);
  };

  const onSubmit: React.MouseEventHandler<HTMLInputElement> = (event) => {
    if (itemName !== null && itemName !== '') {
      if (!editMode) {
        addItemInList({
          id: generateID(),
          value: itemName.replace(' ', '__-'),
          label: itemName,
        });
      } else {
        editIteminList({
          id: editItemId as string,
          value: itemName.replace(' ', '__-'),
          label: itemName,
        });
      }
    }
  };

  const cancelEditing = () => {
    setEditMode(false);
    setItemName('');
    setEditItemId(undefined);
  };

  const markAsAnswer = (item: FormLayoutCoponentChildrenItemsType) => {
    const updatedItem = {
      ...item,
      is_answer: true, // Ensure the key-value pair is added
    };

    // Update the item in the parent component's state
    editIteminList(updatedItem);
  };


  return (
    <>
      <div>
        <TextField
          label="Item Name"
          name="newItem"
          value={itemName}
          onChange={handleChange}
          style={{ minWidth: '100%' }}
        />
        <input
          className="btn btn-light btn-shadow m-t-20 m-r-10"
          value={editMode ? 'Edit Item' : 'Add Item'}
          type="button"
          onClick={onSubmit}
        />
        {editMode && (
          <input
            className="btn btn-light btn-shadow m-t-20 m-r-10"
            value="Cancel"
            type="button"
            onClick={cancelEditing}
          />
        )}
        <List component="nav">
          {items?.map((item, ind) => {
            return (
              <ListItem key={item.value} style={{ backgroundColor: item.is_answer ? '#dff0d8' : 'inherit' }}>
                <ListItemText primary={item.label} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => changeToEditMode(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteItemFromList(item)} edge="end">
                    <Delete />
                  </IconButton>
                  <Tooltip title="Make this the answer">
                    <IconButton onClick={() => markAsAnswer(item)} edge="end">
                      <CheckCircle color={item.is_answer ? 'primary' : 'inherit'} />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>

            );
          })}
        </List>
      </div>
    </>
  );
};

export default ManageItemsListComponent;
