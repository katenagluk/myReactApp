import img from './error.gif';
// как обратиться к статичному файлу папки public
// пример как прописывать путь process.env.PUBLIC_URL + '/error.gif'
const ErrorMessage = () => {
    return (
        <img style={{ display: 'block', width: "250px", height: "250px", objectFit: 'contain', margin: "0 auto"}} src={img} alt="Error"/>
    )
}

export default ErrorMessage;