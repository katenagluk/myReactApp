// УРОК 153 ПРЕДОХРАНИТЕЛИ
// Мы используем предохранитель для CharList, RandomChar, CharInfo
// Для разных блоков лучше использовать разные предохранители
// Предохранители используются для блоков кода, которые потенциально могут сломаться в Реакте.

import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage/>
        }
        return this.props.children;
    }
}

export default ErrorBoundary;