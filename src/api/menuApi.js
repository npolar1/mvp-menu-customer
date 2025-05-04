import mockMenuData from '../data/mockData';

const getMenu = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockMenuData);
        }, 1500);
    });
}

export { getMenu };