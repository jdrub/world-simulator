import styled from 'styled-components';

const bgColor = '#0069ed';
const grassGreen = '#8bdb78';

export default styled.button`
    width: 75px;
    height: 75px;

    position: absolute;
    top: 10%;
    left: 10%;
    margin: 0;
    padding: 0;

    background: ${bgColor};

    text-decoration: none;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: none;

    color: ${grassGreen};
    font-family: sans-serif;
    font-size: 1rem;
    text-align: center;

    cursor: pointer;

    border: none;
    border-width: 2px;
    border-color: ${grassGreen};
    border-style: solid;
    background: transparent;
    border-radius: 50%;

    :hover,
    :focus {
        background: #8bdb78;
        color: #151515;
    }

    :focus {
        outline: 1px solid #fff;
        outline-offset: -4px;
    }

    transition: transform 150ms ease;
    :active {
        transform: scale(0.99);
    }
`;
