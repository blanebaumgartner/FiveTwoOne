function DoneButton(props) {
  return <button>Done</button>
}

function EditButton(props) {
  return <button>Edit</button>;
}

function BackButton(props) {
  return {
    id: 'back',
    text: null,
    icon: <i className='fas fa-angle-left'></i>,
    cb: props.cb
  };
}

export { DoneButton, EditButton, BackButton }