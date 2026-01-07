/// <reference types="cypress" />

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов
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
      cy.get('[class*=burger-constructor]')
        .contains('Краторная булка N-200i (верх)')
        .should('exist');
      cy.get('[class*=burger-constructor]')
        .contains('Краторная булка N-200i (низ)')
        .should('exist');
    });

    it('должен добавить начинку в конструктор', () => {
      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем что начинка появилась в конструкторе
      cy.get('[class*=burger-constructor]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
    });

    it('должен добавить соус в конструктор', () => {
      // Добавляем соус
      cy.contains('Соус Spicy-X')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем что соус появился в конструкторе
      cy.get('[class*=burger-constructor]')
        .contains('Соус Spicy-X')
        .should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открывать модальное окно при клике на ингредиент', () => {
      // Кликаем на ингредиент (на ссылку с картинкой)
      cy.contains('Краторная булка N-200i').click();

      // Проверяем что модальное окно открылось
      cy.get('#modals').find('[class*=modal]').should('exist');
    });

    it('должен отображать данные ингредиента в модальном окне', () => {
      cy.contains('Краторная булка N-200i').click();

      // Проверяем данные в модальном окне
      cy.get('#modals').contains('Краторная булка N-200i').should('exist');
      cy.get('#modals').contains('420').should('exist'); // калории
      cy.get('#modals').contains('80').should('exist'); // белки
      cy.get('#modals').contains('24').should('exist'); // жиры
      cy.get('#modals').contains('53').should('exist'); // углеводы
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();

      // Проверяем что модалка открыта
      cy.get('#modals').find('[class*=modal]').should('exist');

      // Кликаем на кнопку закрытия
      cy.get('#modals').find('button').click();

      // Проверяем что модалка закрылась
      cy.get('#modals').find('[class*=modal]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();

      // Проверяем что модалка открыта
      cy.get('#modals').find('[class*=modal]').should('exist');

      // Кликаем на оверлей (элемент с классом overlay)
      cy.get('[class*=overlay]').click({ force: true });

      // Проверяем что модалка закрылась
      cy.get('#modals').find('[class*=modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Устанавливаем моковые токены авторизации
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      cy.setCookie('accessToken', 'mock-access-token');

      // Перехватываем запрос на получение данных пользователя
      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      // Перехватываем запрос на создание заказа
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
    });

    afterEach(() => {
      // Очищаем токены после теста
      localStorage.removeItem('refreshToken');
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
      cy.get('#modals').find('[class*=modal]').should('not.exist');

      // Проверяем что конструктор очистился
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
