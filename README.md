# Проектная работа "Веб-ларек"

### Стек технологий:

- **HTML**
- **SCSS**
- **TS**
- **Webpack**

### Структура проекта:

- **src/** — Исходные файлы проекта
- **src/components/** — Папка с JS компонентами
- **src/components/base/** — Папка с базовым кодом

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

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в Presenter для обработки событий и в слоях приложения для генерации событий.

Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:

- `on` — подписка на событие;
- `emit` — инициализация события;
- `trigger` — возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Слой Model

#### Класс ProductModel

Класс отвечает за управление информацией о товарах, включая их загрузку, обновление и управление состоянием.

Конструктор класса:

- `events: EventEmitter` — Экземпляр класса EventEmitter для инициации и обработки событий при изменении данных заказа.

Поля класса:

- `id: string` — Уникальный идентификатор товара.
- `description: string` — Описание товара.
- `image: string` — Путь к изображению товара.
- `title: string` — Название товара.
- `category: string` — Категория товара.
- `price: number | null` — Цена товара. Может быть `null`, если цена не указана.

Методы класса:

- `getProductDetails()` — Метод для получения полной информации о продукте в виде объекта. Возвращает объект с данными продукта.
- `updateProductDetails(update: { id?: string; description?: string; image?: string; title?: string; category?: string; price?: number | null })` — Метод для обновления информации о продукте. Принимает объект с новыми значениями полей продукта и обновляет соответствующие свойства.
- `validateProduct()` — Метод для проверки корректности данных продукта, таких как наличие всех необходимых полей и корректность значений. Возвращает `true`, если продукт корректен, и `false`, если есть ошибки.

#### Класс OrderModel

Класс отвечает за управление информацией о заказах.

Конструктор класса:

- `events: EventEmitter` — Экземпляр класса EventEmitter для инициации и обработки событий при изменении данных заказа.

Поля класса:

- `payment: string` — Способ оплаты заказа (например, "online").
- `email: string` — Электронная почта покупателя.
- `phone: string` — Телефонный номер покупателя.
- `address: string` — Адрес доставки.
- `total: number` — Общая сумма заказа.
- `items: string[]` — Список идентификаторов товаров в заказе.

Методы класса:

- `calculateTotal()` — Метод для вычисления общей суммы заказа на основе цен товаров. Использует данные о товарах и их количество в заказе.
- `validateOrder()` — Метод для проверки корректности данных заказа, таких как сумма и наличие всех необходимых полей. Возвращает `true`, если заказ корректен, и `false`, если есть ошибки.
- `getOrderDetails()` — Метод для получения полной информации о заказе в виде объекта. Возвращает объект с данными заказа.
- `updateOrderDetails(update: { payment?: string; email?: string; phone?: string; address?: string; total?: number; items?: string[] })` — Метод для обновления информации о заказе. Принимает объект с новыми значениями полей заказа и обновляет соответствующие свойства.

### Слой View

Классы отвечают за отображение данных в соответствующих элементах интерфейса (DOM-элементах), предоставляя пользователю возможность взаимодействия с информацией.

#### Базовый Класс Component

Класс является дженериком и родителем всех компонентов слоя представления.

Конструктор класса:

- `element: HTMLElement` — Основной родительский контейнер компонента, в который будет отрисовываться содержимое.

Методы класса:

- `render(data: T): HTMLElement` — Метод для отображения данных в компоненте. Принимает объект типа `T`, сохраняет его в соответствующих полях компонентов через сеттеры и возвращает обновленный DOM-элемент (`element`) компонента.

#### Класс Modal

Класс отвечает за управление модальным окном на странице.

Конструктор класса:

- `selector: string` — Селектор, по которому в DOM идентифицируется модальное окно.
- `events: EventEmitter` — Экземпляр класса EventEmitter для взаимодействия с другими компонентами через события.

Поля класса:

- `modal: HTMLElement` — Элемент модального окна, найденный по переданному селектору.
- `events: EventEmitter` — Экземпляр брокера событий для управления событиями, связанными с модальным окном.

Методы класса:

- `open(): void` — Метод для открытия модального окна. Выполняет действия для отображения окна и взаимодействия с пользователем.
- `close(): void` — Метод для закрытия модального окна. Реализует скрытие окна и отмену слушателей событий.
- `setEventListeners(): void` — Устанавливает слушатели событий для закрытия окна при нажатии на клавишу "Esc", клике на оверлей или на кнопку "крестик".

#### Класс ProductModal

Расширяет класс Modal. Отвечает за реализацию модального окна, отображающего подробности о товаре. Позволяет взаимодействовать с товаром (например, добавление в корзину).

Конструктор класса:

- `constructor(selector: string, events: IEvents, onAddToCart: (productId: string) => void)` — Конструктор принимает селектор для нахождения модального окна в DOM, экземпляр класса EventEmitter для инициации событий и обработчик `onAddToCart`, который будет вызываться при нажатии на кнопку "В корзину".

Поля класса:

- `modal: HTMLElement` — Элемент модального окна, унаследованный от базового класса Modal.
- `events: IEvents` — Экземпляр класса EventEmitter для инициации и обработки событий.
- `onAddToCart: (productId: string) => void` — Обработчик для выполнения действия добавления товара в корзину.
- `productData: ProductModel | null` — Данные о товаре, которые будут отображаться в модальном окне.

Методы класса:

- `open(product: ProductModel, handleAddToCart: Function): void` — Расширяет метод `open` из базового класса Modal. Принимает объект товара ProductModel и устанавливает его данные в модальном окне. Также принимает функцию-обработчик для добавления товара в корзину, которая сохраняется в поле `handleAddToCart`. Настраивает обработчики событий для кнопок.
- `close(): void` — Расширяет метод `close` из базового класса Modal. Используется для скрытия модального окна и сброса состояния.
- `setupEventListeners(): void` — Приватный метод. Устанавливает слушатели событий для кнопки "В корзину". Вызывается в конструкторе для инициализации специфичных событий.
- `setProductData(product: ProductModel): void` — Метод для установки данных о товаре в модальном окне. Обновляет информацию, отображаемую в модальном окне, на основе переданного объекта ProductModel.

#### Класс CartModal

Расширяет класс `Modal`. Отвечает за отображение и управление корзиной товаров. Позволяет просматривать добавленные товары, изменять их количество, удалять из корзины и переходить к оформлению заказа.

Конструктор класса:

- `constructor(selector: string, events: IEvents, onCheckout: (cartData: T[]) => void)` — Конструктор принимает селектор для нахождения модального окна в DOM, экземпляр класса `EventEmitter` для инициации событий и обработчик `onCheckout`, который будет вызываться при нажатии на кнопку "Оформить заказ".

Поля класса:

- `modal: HTMLElement` — Элемент модального окна, унаследованный от базового класса `Modal`.
- `events: IEvents` — Экземпляр класса `EventEmitter` для инициации и обработки событий.
- `onCheckout: (cartData: T[]) => void` — Обработчик для оформления заказа.
- `cartItems: T[]` — Массив товаров, добавленных в корзину.
- `totalPrice: number` — Общая сумма заказа, рассчитанная на основе цен товаров в корзине.

Методы класса:

- `open(cartItems: IOrder | IOrder[], onCheckout: (cartData: IOrder[]) => void): void` — Расширяет метод `open` из базового класса `Modal`. Принимает один заказ `IOrder` или массив заказов `IOrder[]`, отображает товары в корзине и устанавливает обработчик для оформления заказа. Если передан один заказ, извлекаются товары из него. Устанавливает переданный обработчик `onCheckout`, который будет вызван при оформлении заказа.
- `setupEventListeners(): void` — Приватный метод. Устанавливает слушатели событий для кнопок "Удалить товар" и "Оформить заказ", а также добавляет обработчики для пересчета и отображения общей суммы заказа. Вызывается в конструкторе для инициализации специфичных событий.
- `removeItem(itemId: string): void` — Удаляет товар из корзины по идентификатору `itemId` и пересчитывает общую сумму заказа.
- `calculateTotal(): void` — Пересчитывает общую сумму заказа на основе текущих товаров, добавленных в корзину. Учитывает количество товаров, а также их цену. Общая сумма отображается в элементе DOM, который показывает итоговую цену.
- `updateCartItems(cartItems: { id: string; quantity: number }[]): void` — Обновляет отображаемые товары в корзине на основе переданного массива объектов с полями `id` и `quantity`. Включает пересчёт общей суммы заказа после обновления.
- `submitOrder(): void` — Инициирует процесс оформления заказа, передавая массив товаров через событие или вызов обработчика `onCheckout`.
- `renderCartItems(): void` - Отображает текущие товары в корзине, обновляя список на основе `this.items`.

#### Класс OrderDetailsModal

Расширяет класс Modal. Отвечает за отображение и управление формой оформления заказа в два этапа: выбор способа оплаты и доставки, а затем ввод контактной информации.

Конструктор класса:

- `constructor(selector: string, events: EventEmitter, onSubmit: (orderData: IOrder) => void, orderModel: OrderModel)` — Конструктор принимает селектор для нахождения модального окна в DOM, экземпляр класса `EventEmitter` для инициации событий, обработчик `onSubmit`, который вызывается при окончательном оформлении заказа, и объект модели заказа `orderModel`.

Поля класса:

- `modal: HTMLElement` — Элемент модального окна, унаследованный от базового класса Modal.
- `events: EventEmitter` — Экземпляр класса EventEmitter для обработки событий.
- `onSubmit: (orderData: IOrder) => void` — Обработчик для передачи данных заказа при его оформлении.
- `payment: string` — Выбранный способ оплаты (например, "online" или "cash").
- `address: string` — Адрес доставки, введенный пользователем.
- `email: string` — Email клиента, введенный на втором этапе.
- `phone: string` — Номер телефона клиента, введенный на втором этапе.
- `currentStep: number` — Номер текущего шага оформления (1 или 2).

Методы класса:

- `open(orderData: IOrder): void` — Расширяет метод `open` из базового класса Modal. Отображает первый этап формы (выбор оплаты и доставки), сбрасывает поля и устанавливает события для валидации полей. В случае открытия модального окна все поля сбрасываются в начальное состояние.
- `close(): void` — Расширяет метод `close` из базового класса Modal. Скрывает модальное окно и сбрасывает введенные данные.
- `setupEventListeners(): void` — Приватный метод. Устанавливает слушатели событий для полей формы и кнопок. Управляет переходами между этапами формы, валидацией данных и изменением текста на кнопках ("Далее", "Оплатить", "Оформить"). Вызывается в конструкторе для инициализации специфичных событий.
- `validateStep1(): boolean` — Проверяет правильность заполнения полей первого этапа (способ оплаты и адрес доставки). Если все поля корректны, активирует кнопку "Далее".
- `validateStep2(): boolean` — Проверяет правильность полей второго этапа (email и телефон). При успешной валидации активирует кнопку "Оплатить" или "Оформить".
- `goToNextStep(): void` — Скрывает поля первого этапа и отображает второй этап (контактная информация).
- `submitOrder(cartItems: { id: string; quantity: number }[], total: number): void` — Формирует объект заказа (`IOrder`) и передает его в обработчик `onSubmit`. Включает данные о доставке, способе оплаты и контактной информации. Вызывает валидацию обоих этапов перед отправкой.
- `updatePaymentMethodUI(): void` - Обновляет пользовательский интерфейс в зависимости от выбранного способа оплаты. Изменяет состояние кнопок и блокирует кнопку "Далее", если способ оплаты не выбран.

#### Класс SuccessModal

Расширяет класс `Modal`. Отвечает за отображение сообщения об успешном завершении заказа. Позволяет пользователю увидеть подтверждение успешного оформления и перейти на главную страницу.

Конструктор класса:

- `constructor(selector: string, events: IEvents, onReturnHome: () => void)` — Конструктор принимает селектор для нахождения модального окна в DOM, экземпляр класса EventEmitter для инициации событий и обработчик `onReturnHome`, который вызывается при нажатии на кнопку "За новыми покупками".

Поля класса:

- `modal: HTMLElement` — Элемент модального окна, унаследованный от базового класса `Modal`.
- `events: IEvents` — Экземпляр класса EventEmitter для обработки событий.
- `onReturnHome: () => void` — Обработчик для возвращения на главную страницу.
- `amount: number` — Сумма, списанная за заказ.

Методы класса:

- `open(amount: number): void` — Расширяет метод `open` из базового класса `Modal`. Принимает сумму заказа и отображает ее вместе с сообщением об успешном оформлении. Также устанавливает обработчик для кнопки "За новыми покупками".
- `close(): void` — Расширяет метод `close` из базового класса `Modal`. Используется для скрытия модального окна и сброса состояния.
- `setupEventListeners(): void` — Приватный метод. Устанавливает слушатели событий для кнопки "За новыми покупками", которая вызывает сохраненный обработчик.
- `onReturnHome`. Вызывается в конструкторе для инициализации специфичных событий.

#### Класс Card

Отвечает за отображение карточки товара, включая название, изображение, цену и категорию. Класс используется для отображения товаров на странице сайта и для открытия модального окна с деталями товара при нажатии на карточку.

Конструктор класса:

- `constructor(template: HTMLElement, events: IEvents)` — Конструктор принимает DOM элемент темплейта для создания карточек и экземпляр `EventEmitter` для инициации событий.

Поля класса:

- `element: HTMLElement` — Основной DOM элемент карточки.
- `events: IEvents` — Экземпляр класса `EventEmitter` для обработки событий.

Методы класса:

- `render(productData: ProductModel): HTMLElement` — Отображает данные о товаре в карточке. Принимает объект `ProductModel`, который содержит информацию о товаре, и заполняет карточку соответствующими данными. Возвращает обновленный DOM элемент карточки.
- `update(productData: ProductModel): void` — Метод для обновления информации в карточке. Принимает новый объект `ProductModel` и обновляет содержимое карточки на основе новых данных.
- `openProductModal(): void` — Метод для открытия модального окна с подробной информацией о товаре. Генерирует событие для открытия модального окна с деталями товара, используя данные карточки.

#### Класс CardsContainer

Отвечает за отображение блока с карточками товаров на главной странице. Класс управляет размещением карточек в указанном контейнере и обновляет содержимое при изменении данных.

Конструктор класса:

- `constructor(container: HTMLElement, events: IEvents)` — Конструктор принимает элемент контейнера (`container`), в котором будут размещаться карточки, и экземпляр класса `EventEmitter` (`events`) для инициации и обработки событий.

Поля класса:

- `container: HTMLElement` — Элемент контейнера, в который будут добавляться карточки.
- `events: IEvents` — Экземпляр класса `EventEmitter` для обработки событий, связанных с карточками.

Методы класса:

- `render(cardsData: ProductModel[]): void` — Метод для отображения карточек товаров. Принимает массив объектов `ProductModel`, создает карточки на основе этих данных и добавляет их в контейнер. Если массив пуст, ничего не добавляется. Устанавливает слушатели на интерактивные элементы карточек и генерирует события через `EventEmitter`.

### Слой Presenter

#### Класс AppApi

Отвечает за взаимодействие с бэкендом сервиса. Принимает в конструктор экземпляр класса `Api` и предоставляет методы для выполнения операций CRUD и управления корзиной и заказами.

Конструктор класса:

- `constructor(api: Api)` — Конструктор принимает экземпляр класса `Api` для выполнения HTTP-запросов.

Методы класса:

- `getProducts<T>(): Promise<T[]>` — Запрашивает список продуктов с сервера и возвращает массив объектов типа `T`, где `T` — это модель продукта.
- `getProductById<T>(productId: string): Promise<T>` — Запрашивает данные о конкретном продукте по его ID и возвращает объект типа `T`.
- `getCart<T>(): Promise<T[]>` — Запрашивает данные о текущей корзине пользователя и возвращает массив объектов типа `T`.
- `updateCart<T>(cartData: T[]): Promise<T[]>` — Отправляет запрос на обновление корзины и возвращает обновленный массив объектов типа `T`.
- `placeOrder<T>(orderData: T): Promise<T>` — Отправляет запрос на оформление заказа и возвращает объект типа `T` с данными о заказе.

#### Класс AppPresenter

Отвечает за взаимодействие между слоями представления и моделью данных. Обрабатывает события, генерируемые интерфейсом, и управляет взаимодействием между компонентами.

Конструктор класса:

- `constructor(api: AppApi, events: EventEmitter, productModal: ProductModal, cartModal: CartModal, orderModal: OrderDetailsModal, successModal: SuccessModal, cardsContainer: CardsContainer)` — Конструктор принимает экземпляры необходимых классов и инициализирует обработку событий.

Методы класса:

- `initialize(): void` — Инициализирует обработку событий и устанавливает начальное состояние представления.
- `handleProductSelect(productId: string): void` — Обрабатывает выбор товара для отображения в модальном окне. Запрашивает данные о товаре через `AppApi`, отображает информацию в `ProductModal`.
- `handleAddToCart(productId: string): void` — Обрабатывает добавление товара в корзину. Обновляет корзину через `AppApi` и отображает изменения в `CartModal`.
- `handleCartOpen(): void` — Открывает модальное окно корзины и отображает текущее состояние корзины.
- `handleOrderSubmit(orderData: OrderModel): void` — Обрабатывает оформление заказа. Отправляет данные через `AppApi`, получает подтверждение и отображает `SuccessModal`.
- `handleSuccess(): void` — Обрабатывает успешное завершение заказа, отображает соответствующее сообщение в `SuccessModal`.

Список событий

Изменение данных (генерируются моделями данных):

- `product:updated` — Изменение данных о продукте.
- `cart:updated` — Изменение содержимого корзины.
- `order:placed` — Оформление нового заказа.

Взаимодействие с интерфейсом (генерируются представлениями):

- `product:select` — Выбор товара для отображения в модальном окне.
- `cart:open` — Открытие модального окна корзины.
- `order:submit` — Оформление заказа.
- `order:success` — Подтверждение успешного завершения заказа.
