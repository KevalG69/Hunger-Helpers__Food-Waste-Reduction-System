import '../../css/Elements/AuthButton.css'


function AuthButton(props)
{
    return(
        <button className="Auth_btn" type='submit'>{props.name}</button>
    )
}

export default AuthButton;