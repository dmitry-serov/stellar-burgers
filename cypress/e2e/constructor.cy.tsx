/// <reference types="cypress" />

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы к API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Находим булку и нажимаем "Добавить"
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем что булка появилась в конструкторе (верх и низ)
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должен добавить начинку в конструктор', () => {
      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем что начинка появилась в конструкторе
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });

    it('должен добавить соус в конструктор', () => {
      // Добавляем соус
      cy.contains('Соус Spicy-X')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем что соус появился в конструкторе
      cy.contains('Соус Spicy-X').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открывать модальное окно при клике на ингредиент', () => {
      // Кликаем на ссылку ингредиента (Link компонент)
      cy.contains('a', 'Краторная булка N-200i').click();

      // Проверяем что модальное окно открылось
      cy.get('#modals').children().should('have.length.greaterThan', 0);
    });

    it('должен отображать данные ингредиента в модальном окне', () => {
      cy.contains('a', 'Краторная булка N-200i').click();

      // Проверяем данные в модальном окне
      cy.get('#modals').contains('Краторная булка N-200i').should('exist');
      cy.get('#modals').contains('420').should('exist'); // калории
      cy.get('#modals').contains('80').should('exist'); // белки
      cy.get('#modals').contains('24').should('exist'); // жиры
      cy.get('#modals').contains('53').should('exist'); // углеводы
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.contains('a', 'Краторная булка N-200i').click();

      // Проверяем что модалка открыта
      cy.get('#modals').children().should('have.length.greaterThan', 0);

      // Кликаем на кнопку закрытия
      cy.get('#modals').find('button').click();

      // Проверяем что модалка закрылась
      cy.get('#modals').children().should('have.length', 0);
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.contains('a', 'Краторная булка N-200i').click();

      // Проверяем что модалка открыта
      cy.get('#modals').children().should('have.length.greaterThan', 0);

      // Кликаем на оверлей (второй child в #modals)
      cy.get('#modals').children().last().click({ force: true });

      // Проверяем что модалка закрылась
      cy.get('#modals').children().should('have.length', 0);
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Перехватываем запрос на получение данных пользователя
      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      // Перехватываем запрос на создание заказа
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      // Устанавливаем моковые токены авторизации ПЕРЕД визитом
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'mock-refresh-token');
      });
      cy.setCookie('accessToken', 'mock-access-token');

      // Перезагружаем страницу чтобы приложение проверило авторизацию
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      // Очищаем токены после теста
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookie('accessToken');
    });

    it('должен создать заказ и показать номер в модальном окне', () => {
      // Собираем бургер: добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Нажимаем кнопку "Оформить заказ"
      cy.contains('button', 'Оформить заказ').click();

      // Ждем завершения запроса
      cy.wait('@createOrder');

      // Проверяем что открылось модальное окно с номером заказа
      cy.get('#modals').contains('12345').should('exist');

      // Закрываем модальное окно
      cy.get('#modals').find('button').click();

      // Проверяем что модалка закрылась
      cy.get('#modals').children().should('have.length', 0);

      // Проверяем что конструктор очистился
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
