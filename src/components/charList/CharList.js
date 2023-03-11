// УРОК 151 ПРИМЕР ДИНАМИЧЕСКОГО ПОЛУЧЕНИЯ ДАННЫХ ИЗ СЕРВЕРА ДЛЯ НЕСКОЛЬКИХ КАРТОЧЕК

import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

// превращаем CharList в компонент и импортируем его
class CharList extends Component {
    // создаем объект state
    // создаем пустой массив для заполнения в будущем данными из сервера Марвел
    // newItemLoading - подгрузка новых персонажей
    // offset - 210 - начальное значение отступа
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }
    // в MarvelService создается запрос на сервер
    marvelService = new MarvelService();
    // создаем промис. запрос на сервер + загрузка + ошибка
    componentDidMount() {
        this.onRequest();
        // this.marvelService.getAllCharacters()
        //     .then(this.onCharListLoaded)
        //     .catch(this.onError)
    }
    // УРОК 154. Добавление персонажей при клике на кнопку
    // порядок действий: у нас есть метод onRequest, который отвечает за запрос на сервер. Мы его вызываем первый раз когда наш компонент отрендерился. И он ориентируется на наш baseOffset (отступ). сначала используем базовый отступ а потом будет другое число. Далее запускается onCharListLoaded -  получает в себя новые данные и формируем новое состояние. charList изначально будет пустым массивом. Далее разворачиваются новые массивы с учетом предыдущего.
    // метод onCharListLoading переключает подгрузку персонажей только при клике на кнопку. Мы меняем переменную newItemLoading в позицию true. 

    // тут мы оптимизируем код, который выше, потому что там действия эквивалентны
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }
    // запуск и загрузка новых персонажей
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    // в случае долгой загрузки
    // возвращаем объект из функции
    // проверяет закончились ли персонажи при подгрузке страницы
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }
    // в случае ошибки
    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    // УРОК 159 РЕФЫ
    itemRefs = [];
    setRef = (ref) => {
        this.itemRefs.push(ref);
    }
    // переключение класса для выбранного персонажа (подсветка)
    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    // формируем верстку с помощью map, чтобы не писать кучу однотипной верстки. у нас на сайте 9 одинаковых блоков с картинками и подписями + одна кнопка снизу. также мы используем из сервера альтернативный текст и из условия инлайн стиль imgStyle

    // динамически меняем свойство object fit для загружаемой картинки. в зависимости того там стоит картинка-заглушка по умолчанию, либо обычная картинка
    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <li
                    className="char__item"
                    // REF
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    // событие клика
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    // для работы с сайтом с клавиатуры
                    onKeyDown={(e) => {
                        if (e.key === '' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                    }
                }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // центрирование спиннера или ошибки с помощью класса char__grid
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    // рендер на страницу
    // сюда передаем наш массив с данными: айди, картинка, альтернативный текст и имя героя (выше в теге <li/>)
    // вставляем в верстку переменные. через тернарный оператор проверяем true или false наши loading и error. Если true, то используем данные из файлов js - <Spinner/> и <ErrorMessage/>
    // добавляем функцию renderItems
    render () {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
// Проверка через PropTypes функция ли onCharSelected
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;