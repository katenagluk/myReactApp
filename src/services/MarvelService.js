class MarvelService {
    // переменные начинаются с лодыша _ потому что они очень важные и их нельзя менять
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=2b11bbd9fa12c6f54b5b15c4efe3b318';
    _ts = 'ts=1';
    _hash = 'hash=264aaa305532cd751dc758afaa69080d';
    _baseOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    }
    // тут можно оптимизировать строку. вывести части строки в отдельные переменные
    // берем ссылку с сайта Марвел. вставляем в ковычках обязательно
    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}&${this._ts}&${this._hash}`);
        return res.data.results.map(this._transformCharacter);
    }
    // а тут бэктики и вставляем через интерполяцию id
    // async и await работают только в паре
    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}&${this._ts}&${this._hash}`);
        return this._transformCharacter(res.data.results[0]);
    }
    // очень важная функция которая начинается с лодыша _
    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? ((char.description.length >= 100) ? `${char.description.slice(0, 100)}...` : char.description) : 'No information yet',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;
