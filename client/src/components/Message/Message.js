const getStyle = props => {
  let baseClass = 'alert alert-dismissible fade show text-center mb-5'
  if (props.msgError) baseClass += ' alert-danger'
  else baseClass += ' alert-primary'
  return baseClass
}

const Message = (props) => {
  return (
    <div className={getStyle(props)} role="alert">
      {props.msgBody}
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}

export default Message