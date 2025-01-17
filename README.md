# Проектная работа "Веб-ларек"

### Стек технологий:

- **HTML**
- **SCSS**
- **TS**
- **Webpack**

### Структура проекта:

- **src/** — Исходные файлы проекта
- **src/components/** — Папка с TS компонентами
- **src/components/base/** — Папка с кодом базовых классов
- **src/components/common/** — Папка с кодом общих наследуемых классов
- **src/components/view/** — Папка с кодом классов, относящихся к слою View

### Важные файлы:

- **src/pages/index.html** — HTML-файл главной страницы
- **src/types/index.ts** — Файл с типами
- **src/index.ts** — Точка входа приложения
- **src/utils/constants.ts** — Файл с константами
- **src/utils/utils.ts** — Файл с утилитами

## Архитектура приложения

### Код приложения составлен в парадигме MVP:

- **Слой Model**: Отвечает за хранение и изменение данных.
- **Слой View**: Отвечает за отображение данных на странице.
- **Слой Presenter**: Отвечает за связь между View и Model.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и объект с заголовками запросов.

Методы класса:

- `get` — выполняет GET-запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
- `post` — принимает объект с данными, которые будут переданы в JSON-формате в теле запроса, и отправляет эти данные на ендпоинт, переданный как параметр при вызове метода. По умолчанию выполняется POST-запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс Component

Класс является абстрактным и используется как базовый для всех компонентов слоя представления. Он предоставляет основные методы для рендеринга содержимого и управления состоянием элементов.

Конструктор класса:

- `constructor(protected readonly container: HTMLElement)` - Конструктор принимает основной контейнер для компонента. Этот контейнер будет использоваться для вставки содержимого компонента.

Методы класса:

- `render(data?: Partial<T>): HTMLElement` - Метод для отображения данных в компоненте. Принимает объект данных типа T (или его частичную версию через Partial<T>), обновляет поля компонента с помощью `Object.assign()` и возвращает контейнер компонента с обновленным содержимым.
- `setDisabled(element: HTMLElement, state: boolean): void` - Метод для управления состоянием элемента. Если `state` равно `true`, устанавливается атрибут `disabled`, который деактивирует элемент. Если `state` равно `false`, атрибут `disabled` удаляется, активируя элемент.
- `setText(element: HTMLElement, value: string): void` — Метод для обновления текста в указанном элементе. Устанавливает текстовое содержимое элемента, преобразуя переданное значение в строку с помощью `String(value)`.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в Presenter для обработки событий и в слоях приложения для генерации событий.

Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:

- `on` — подписка на событие;
- `emit` — инициализация события;
- `trigger` — возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

#### Класс Model

Класс представляет собой базовую реализацию модели данных для слоя Model в архитектуре MVP. Используется для управления данными и взаимодействия с брокером событий.

Конструктор класса:

- `constructor(data: Partial<T>, protected events: IEvents)` - Конструктор принимает `data: Partial<T>` - частичные данные модели, которые будут скопированы в объект модели через Object.assign. Это позволяет модели быть гибкой к изменениям структуры данных и `events: IEvents` - экземпляр брокера событий для генерации и обработки событий.

Методы класса:

- `emitChanges(event: string, payload?: object)` - Инициирует событие с указанным названием и переданными данными. Используется для уведомления других слоев приложения об изменениях в модели.

### Слой Model

#### Класс UserData

Этот класс предназначен для работы с данными пользователя, включая контактную информацию и данные заказа. Он обрабатывает ввод, выполняет валидацию и генерирует события, когда данные готовы.

Поля класса:

- `payment` — Способ оплаты пользователя.
- `address` — Адрес пользователя.
- `email` — Адрес электронной почты пользователя.
- `phone` — Телефон пользователя.
- `formErrors` — Объект, содержащий ошибки валидации для каждого поля данных заказа.

Методы класса:

- `setUserOrder(field: keyof IOrder, value: string)` — Устанавливает значение для указанного поля данных заказа и выполняет валидацию. Если все данные в порядке, генерируются события `contacts:ready` и `order:ready`.
- `getUserData()` — Возвращает объект с данными заказа (адрес, способ оплаты, email и телефон) в виде `Partial<IOrder>`.
- `validateOrder()` — Валидирует поля `address` и `payment`. Генерирует событие `orderFormErrors:change` с ошибками валидации.
- `validateContacts()` — Валидирует поля `email` и `phone`. Генерирует событие `contactsFormErrors:change` с ошибками валидации.
- `isValidEmail(email: string): boolean` — Проверяет, соответствует ли указанный `email` правильному формату. Возвращает `true`, если `email` валиден, и `false` в противном случае.
- `isValidPhone(phone: string): boolean` — Проверяет, соответствует ли указанный телефон правильному формату российского номера. Возвращает `true`, если номер валиден, и `false` в противном случае.

#### Класс CardsData

Класс предназначен для работы с данными списка карт, включая управление состоянием выбора, обновление предпросмотра и расчет общей стоимости выбранных карт. Он обрабатывает ввод данных, генерирует события, когда данные обновляются.

Поля класса:

- `cardsData` — Массив продуктов, доступных в списке.
- `previewData` — Идентификатор текущего продукта для предпросмотра.

Методы класса:

- `set cards(cards)` — Устанавливает список продуктов и сбрасывает их состояния выбора.
- `get cards()` — Возвращает текущий список продуктов.
- `setPreview(card)` — Устанавливает продукт для предпросмотра и генерирует событие `preview:changed`.
- `getCard(cardId)` — Ищет продукт по его идентификатору и возвращает его, если он найден.
- `toggleCardSelection(card)` — Переключает состояние выбора продукта. Генерирует события `preview:changed` и `basket:changed`.
- `getSelectedProducts()` — Возвращает список выбранных продуктов.
- `getTotalPrice()` — Рассчитывает общую стоимость выбранных продуктов.
- `resetSelected()` — Сбрасывает состояние выбора всех продуктов и генерирует событие `basket:changed`.

### Слой View

Классы отвечают за отображение данных в соответствующих элементах интерфейса (DOM-элементах), предоставляя пользователю возможность взаимодействия с информацией.

#### Общий класс Modal

Наследуется от базового класса `Component` и представляет собой универсальное модальное окно. Он предоставляет методы для управления жизненным циклом модального окна (открытие, закрытие) и взаимодействиями с пользователем (например, закрытие через клавишу или мышь). Модальное окно использует интерфейс `IModalData` для передачи данных и брокер событий (`IEvents`) для обработки событий.

Конструктор класса:

- `constructor(container: HTMLElement, events: IEvents)` — Инициализирует модальное окно, принимает контейнер, в котором будет отображаться модалка, и экземпляр `IEvents` для обработки событий.

Поля класса:

- `contentElement: HTMLElement` - Представляет собой область контента модального окна, в которую можно динамически вставлять содержимое.
- `closeButton: HTMLButtonElement` - Кнопка закрытия модального окна.
- `events: IEvents` - Обработчик событий для работы с событиями, связанными с модальным окном.

Методы класса:

- `content(value: HTMLElement)` - Сеттер для контента модального окна. Заменяет старое содержимое на новое.
- `open()` - Открывает модальное окно, добавляя класс `modal_active` и генерирует событие `modal:open`. Также добавляется обработчик для закрытия окна при нажатии клавиши Escape.
- `close()` - Закрывает модальное окно, удаляя класс `modal_active` и генерирует событие `modal:close`. Удаляется обработчик клавиши Escape.
- `handleEscUp(evt: KeyboardEvent)` - Обрабатывает нажатие клавиши Escape. Если модальное окно активно, оно будет закрыто.
- `render(data: IModalData)` - Рендерит модальное окно с переданными данными и вызывает метод `open()` для отображения окна. Возвращает контейнер с модальным окном.

#### Общий класс Form

Реализует форму с возможностью обработки ошибок, обновления состояний и взаимодействия с полями формы. Этот класс наследует от абстрактного компонента `Component`, что позволяет ему работать с различными типами данных и управлять состоянием формы. Он также предоставляет обработку событий, таких как изменение значений в полях и отправка формы.

Конструктор класса:

- `constructor(container: HTMLFormElement, events: IEvents)` — Конструктор принимает контейнер формы `(HTMLFormElement)` и экземпляр класса `IEvents` для обработки событий. В конструкторе также происходят привязки элементов формы, таких как кнопка отправки и элемент для отображения ошибок.

Поля класса:

- `submitButton` — Кнопка для отправки формы.
- `errorContainer` — Элемент для отображения ошибок.
- `container` — Основной контейнер формы.
- `events` — Экземпляр для обработки событий, таких как отправка формы и изменение ввода.

Методы класса:

- `onInputChange(field: keyof T, value: string)` — Обработчик изменения значения в поле формы. Вызывает событие `input:change` для передачи обновленных данных в другие части приложения.
- `valid` — Сеттер для кнопки отправки формы. Если `value` равно `false`, кнопка будет отключена, если `true` — включена.
- `errors` — Сеттер для отображения ошибок на форме. Устанавливает текст ошибки в элемент для отображения ошибок.
- `render(state: Partial<T> & IFormState)` — Метод рендеринга формы с учетом состояния. Принимает данные формы и отображает их, обновляя элементы с помощью метода `render` базового компонента.

#### Класс CatalogPage

Класс `CatalogPage` представляет компонент для отображения каталога товаров на странице, а также управления корзиной покупок. Он позволяет обновлять счётчик товаров в корзине, отображать список товаров и блокировать страницу при необходимости.

Конструктор класса:

- `constructor(container: HTMLElement, events: IEvents)` — Конструктор принимает контейнер страницы и экземпляр класса для работы с событиями. Он инициализирует элементы страницы, такие как счетчик корзины, каталог товаров, кнопку корзины и обертку страницы. Также добавляется обработчик события для открытия корзины при клике на кнопку корзины.

Поля класса:

- `counter: HTMLElement` - Элемент для отображения счетчика товаров в корзине.
- `catalog: HTMLElement` - Элемент, который представляет галерею (каталог товаров), в котором будут отображаться элементы.
- `basket: HTMLButtonElement` - Кнопка, которая открывает корзину при клике.
- `wrapper: HTMLElement` - Обертка страницы, которая может быть заблокирована для предотвращения взаимодействия с остальной частью страницы.

Методы класса:

- `set count(counter: number)` — Метод для обновления отображаемого счетчика товаров в корзине. Принимает число и отображает его в элементе с классом `.header__basket-counter.`
- `set setCatalogItems(items: HTMLElement[])` — Метод для обновления содержимого каталога. Принимает массив HTML-элементов и заменяет текущее содержимое каталога.
- `set isContentLocked(value: boolean)` — Метод для блокировки или разблокировки содержимого страницы. Если значение value равно `true`, добавляется класс `page__wrapper_locked`, который блокирует контент. Если `value` равно `false`, класс удаляется, разблокируя контент.

#### Класс Basket

Представляет корзину покупок на странице и управляет отображением списка товаров, общей стоимостью и состоянием кнопки для оформления заказа. Он наследуется от базового класса `Component` и предоставляет методы для обновления контента корзины и управления состоянием элементов.

Конструктор класса:

- `constructor(container: HTMLElement, events: IEvents)` — Инициализирует корзину, устанавливая элементы DOM и слушатели событий, в том числе для кнопки оформления заказа, которая отправляет событие `order:open`.

Поля класса:

- `items` — Элемент, содержащий список товаров корзины.
- `price` — Элемент, отображающий общую стоимость корзины.
- `button` — Кнопка для перехода к оформлению заказа.
- `container` — Контейнер, в котором содержится корзина.

Методы класса:

- `set total(value: number)` - Обновляет отображение общей стоимости в корзине и управляет состоянием кнопки оформления заказа, блокируя её, если стоимость равна нулю.
- `set list(items: HTMLElement[])` - Заменяет текущий список товаров в корзине на новые элементы.

#### Класс Contacts

Представляет форму для ввода контактных данных пользователя, включая имейл и телефон. Наследуется от класса `FormCommon` и предоставляет функциональность для обработки ввода данных и валидации формы.

Конструктор класса:

- `constructor(container: HTMLFormElement, events: IEvents)` — Инициализирует форму, устанавливая элементы DOM для полей ввода имейла и телефона, а также настраивает обработчики событий для отслеживания изменений в полях и отправки формы.

Поля класса:

- `email` — Поле для ввода email пользователя.
- `phone` — Поле для ввода телефонного номера пользователя.

#### Класс Success

Класс представляет модальное окно для отображения успешной транзакции с возможностью закрытия. Наследуется от базового класса `Component` и управляет отображением информации о списанных синапсах, а также обработкой кликов по кнопке закрытия окна.

Конструктор класса:

- `constructor(container: HTMLElement, onClick?: (event: MouseEvent) => void)` — Инициализирует компонент, находит необходимые элементы на странице и устанавливает обработчик события для кнопки закрытия, если передан `onClick`.

Поля класса:

- `button` — Кнопка для закрытия модального окна.
- `totalElement` — Элемент, отображающий информацию о списанных синапсах.

Методы класса:

- `set total(value: number)` — Обновляет текстовое содержимое элемента `totalElement`, отображая количество списанных синапсов.

#### Класс Order

Представляет форму заказа, где пользователь может выбрать способ оплаты и указать адрес доставки. Класс наследуется от `FormCommon` и реализует функционал обработки взаимодействий с кнопками и изменения ввода.

Конструктор класса:

- `constructor(container: HTMLFormElement, events: IEvents)` — Инициализирует форму заказа, создаёт ссылки на элементы DOM и добавляет обработчики событий для кнопок выбора способа оплаты.

Поля класса:

- `cardButton` — Кнопка для выбора способа оплаты картой.
- `cashButton` — Кнопка для выбора способа оплаты наличными.
- `address` — Поле ввода для указания адреса доставки.

#### Класс CardBasket

Класс представляет карточку товара в корзине, отображая информацию о товаре, такую как название, цена и индекс, и управляет обработкой кликов по кнопке товара.

Конструктор класса:

- `constructor(container: HTMLElement, onClick?: (event: MouseEvent) => void)` — Инициализирует компонент, находит необходимые элементы на странице и устанавливает обработчик события для кнопки, если передан `onClick`.

Поля класса:

- `index` — Элемент, отображающий индекс товара в корзине.
- `button` — Кнопка товара.
- `title` — Элемент, содержащий название товара.
- `price` — Элемент, отображающий цену товара.
- `id` — Уникальный идентификатор товара.

Методы класса:

- `setId(id: string)` — Устанавливает ID товара.
- `getId()` — Получает ID товара.
- `setTitle(title: string)` — Устанавливает название товара.
- `formatPrice(value: number | null)` — Форматирует цену товара.
- `setPrice(price: number)` — Устанавливает цену товара и отключает кнопку, если цена равна `0` или `null`.
- `setIndex(value: number)` — Устанавливает индекс товара в корзине.

#### Класс CardList

Класс представляет карточку товара в списке, которая отображает категорию, изображение и управляет состоянием выбора товара.

Конструктор класса:

- `constructor(container: HTMLElement, onClick?: (event: MouseEvent) => void)` — Инициализирует компонент, находит необходимые элементы на странице и устанавливает обработчик события для кнопки, если передан `onClick`.

Поля класса:

- `category` — Элемент, отображающий категорию товара.
- `image` — Элемент, отображающий изображение товара.

Методы класса:

- `setCategory(category: TProductCategory)` — Устанавливает категорию товара и добавляет соответствующий CSS класс.
- `setImage(image: string)` — Устанавливает источник изображения товара.
- `setSelected(value: boolean)` — Управляет состоянием кнопки товара, отключая её при установке `value` в `true`.

#### Класс CardPreview

Класс представляет карточку товара с превью, которая расширяет функциональность карточки из CardList, добавляя возможность отображать описание товара.

Конструктор класса:

- `constructor(container: HTMLElement, onClick?: (event: MouseEvent) => void)` — Инициализирует компонент, находит необходимые элементы на странице и устанавливает обработчик события для кнопки, если передан `onClick`.

Поля класса:

- `description` — Элемент, отображающий описание товара.

Методы класса:

- `setDescription(description: string)` — Устанавливает описание товара.

### Слой API

#### Класс AppApi

Класс принимает экземпляр класса Api в своем конструкторе и предоставляет методы для взаимодействия с бэкендом сервиса.

Код, который описывает взаимодействие между представлением и данными, находится в файле `index.ts`, который выполняет роль презентера. Взаимодействие осуществляется через события, генерируемые с помощью брокера событий, и обработчики этих событий, которые настраиваются в `index.ts` после создания всех необходимых экземпляров классов.

Методы класса:

- `getCards()` — Получает список карточек продуктов с API. Возвращает `Promise<ApiCardResponse>`.
- `postOrder(order: IOrder)` — Отправляет заказ на API. Возвращает `Promise<ApiOrderResponse>`, разрешается с ответом от API.

### События EventEmitter

События изменения данных (генерируются классами моделей данных):

- `cards:loaded` — Массив карточек был обновлен при загрузке страницы.
- `preview:changed` — Карточка выбрана для открытия в модальном окне.
- `basket:changed` — Требуется перерисовка корзины при добавлении или удалении товара.

События, связанные с взаимодействием с пользователем (генерируются классами представлений):

- `preview:change` — Открытие карточки товара.
- `card:change` — Добавление товара в корзину или его удаление.
- `basket:open` — Открытие корзины.
- `order:open` — Открытие формы для ввода данных на первом этапе оформления заказа.
- `input:change` — Изменение данных в любом поле ввода.
- `order:submit` — Отправка данных пользователя на первом этапе оформления заказа и открытие формы ввода контактных данных.
- `orderFormErrors:change` — Изменение состояния валидации формы заказа.
- `contactsFormErrors:change` — Изменение состояния валидации формы контактных данных.
- `contacts:submit` — Отправка контактных данных пользователя и открытие окна успеха.
- `order:success` — Успешное оформление заказа.
- `modal:open` — Открытие модального окна.
- `modal:close` — Закрытие модального окна.
