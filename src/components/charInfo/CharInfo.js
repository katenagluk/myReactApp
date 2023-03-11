import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
    // loading - false потому что изначально данные загружаться не будут с сайте Марвел, только при нажатии на кнопку
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }
    // взаимодействие с предыдущими результатами. предыдущие пропсы и текущие пропсы. нужно чтобы избежать зацикливания. изменились ли действительно пропсы или вызвался рендер
    // prevState тоже можно сравнивать но пока достаточно только пропсов
    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if(!charId) {
            return;
        }

        // сначала ставим спиннер, получаем данные или ловим ошибку
        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    render () {
        const {char, loading, error} = this.state;

        // заглушка по умолчанию <Skeleton/>. когда у нас НЕ загрузка, НЕ ошибка
        const skeleton = char || loading || error ? null : <Skeleton/>
        console.log(skeleton)
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        // НЕ загрузка, НЕ ошибка и НЕ скелетон
        const content = !(loading || error || !char) ? <View char={char}/> : null;
        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    // как обычно проверка нашей картинки и изменение свойства object fit
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return(
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
            {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        // ниже надпись чтобы игнорировать eslint. он нас предупреждает что условие ниже может пагубно влиять на массив, так как мы его пытаемся поменять, а не создать новый
                        // eslint-disable-next-line
                        if (i > 9) return;
                        return (
                            <li key={i}
                            className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}
// УРОК 155. Используя propTypes, 
// можем проверять значения на массивы, объекты, числа, строки и тд
// Ниже проверяем айди персонажа число ли это. Если нет, то будет ошибка в консоли
// с помощью propTypes можно устанавливать пропсы по умолчанию - default props
CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;