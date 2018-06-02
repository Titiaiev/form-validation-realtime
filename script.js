/* ----------------------------

	CustomValidation prototype

	- Keeps track of the list of invalidity messages for this input
	- Keeps track of what validity checks need to be performed for this input
	- Performs the validity checks and sends feedback to the front end

  CustomValidation прототип
  - Отслеживает списка сообщений недействительности для этого input'a
  - Отслеживает, что срок действия необходимо выполнить для этого input'a проверки
  - Выполняет проверки корректности и посылает обратную связь к переднему концу
	
---------------------------- */

function CustomValidation() {
	this.invalidities = [];
	this.validityChecks = [];
}

CustomValidation.prototype = {
	addInvalidity: function(message) {
		this.invalidities.push(message);
	},
	getInvalidities: function() {
		return this.invalidities.join('. \n');
	},
	checkValidity: function(input) {
		for ( var i = 0; i < this.validityChecks.length; i++ ) {

			var isInvalid = this.validityChecks[i].isInvalid(input);
			if (isInvalid) {
				this.addInvalidity(this.validityChecks[i].invalidityMessage);
			} 

			var requirementElement = this.validityChecks[i].element;
			if (requirementElement) {
				if (isInvalid) {
					requirementElement.classList.add('invalid');
					requirementElement.classList.remove('valid');
				} else {
					requirementElement.classList.remove('invalid');
					requirementElement.classList.add('valid');
				}

			} // end if requirementElement
		} // end for
	}
};



/* ----------------------------

	Validity Checks

	The arrays of validity checks for each input
	Comprised of three things
		1. isInvalid() - the function to determine if the input fulfills a particular requirement
		2. invalidityMessage - the error message to display if the field is invalid
		3. element - The element that states the requirement

    Проверка массивов проверки достоверности для каждого входа состоит из трех вещей
    1. isInvalid () - функция, чтобы определить, является ли вход выполняет конкретное требование
    2. invalidityMessage - сообщение об ошибке для отображения, если поле является недействительным
    3. элемент - элемент, который заявляет требование
	
---------------------------- */

var usernameValidityChecks = [
	{
		isInvalid: function(input) {
			return input.value.length < 3; // здесь можно изменить минимальное кол-во символов для поля Имя
		},
		invalidityMessage: 'В это поле нужно ввести минимум 3 символа',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input) {
			var illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g); // Регулярное выражение для латиницы и цифр
			return illegalCharacters ? true : false;
		},
		invalidityMessage: 'Разрешены только латинские буквы и цифры',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(2)')
	}
];

var passwordValidityChecks = [
	{
		isInvalid: function(input) {
			return input.value.length < 8 | input.value.length > 100;  // здесь можно изменить минимальное и максимальное кол-во символов для поля Пароль
		},
		invalidityMessage: 'Необходимо ввести от 8 до 100 символов',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input) {
			return !input.value.match(/[0-9]/g);
		},
		invalidityMessage: 'Необходима по крайней мере 1 цифра',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(2)')
	},
	{
		isInvalid: function(input) {
			return !input.value.match(/[a-z]/g);
		},
		invalidityMessage: 'Необходима по крайней мере 1 буква в нижнем регистре',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(3)')
	},
	{
		isInvalid: function(input) {
			return !input.value.match(/[A-Z]/g);
		},
		invalidityMessage: 'Необходима по крайней мере 1 буква в верхнем регистре',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(4)')
	},
	{
		isInvalid: function(input) {
			return !input.value.match(/[\!\@\#\$\%\^\&\*]/g);
		},
		invalidityMessage: 'Необходимо ввести хотя бы один специальный символ',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(5)')
	}
];

var passwordRepeatValidityChecks = [
	{
		isInvalid: function() {
			return passwordRepeatInput.value != passwordInput.value;
		},
		invalidityMessage: 'Этот пароль должен совпадать с первым'
	}
];



/* ----------------------------

	Check this input

	Function to check this particular input
	If input is invalid, use setCustomValidity() to pass a message to be displayed

  Проверьте этот input
  Функция, чтобы проверить этот конкретный input
  Если input является недопустимым, используйте setCustomValidity (), чтобы передать сообщение, которое будет отображаться

---------------------------- */

function checkInput(input) {

	input.CustomValidation.invalidities = [];
	input.CustomValidation.checkValidity(input);

	if ( input.CustomValidation.invalidities.length == 0 && input.value != '' ) {
		input.setCustomValidity('');
	} else {
		var message = input.CustomValidation.getInvalidities();
		input.setCustomValidity(message);
	}
}



/* ----------------------------

	Setup CustomValidation

	Setup the CustomValidation prototype for each input
	Also sets which array of validity checks to use for that input

  Настройка CustomValidation
  Установка прототипа CustomValidation для каждого input также устанавливает какой массив действия проверяет, чтобы использовать для этого input

---------------------------- */

var usernameInput = document.getElementById('username');
var passwordInput = document.getElementById('password');
var passwordRepeatInput = document.getElementById('password_repeat');

usernameInput.CustomValidation = new CustomValidation();
usernameInput.CustomValidation.validityChecks = usernameValidityChecks;

passwordInput.CustomValidation = new CustomValidation();
passwordInput.CustomValidation.validityChecks = passwordValidityChecks;

passwordRepeatInput.CustomValidation = new CustomValidation();
passwordRepeatInput.CustomValidation.validityChecks = passwordRepeatValidityChecks;




/* ----------------------------

	Event Listeners

---------------------------- */

var inputs = document.querySelectorAll('input:not([type="submit"])');
var submit = document.querySelector('input[type="submit"');

for (var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('keyup', function() {
		checkInput(this);
	});
}

submit.addEventListener('click', function() {
	for (var i = 0; i < inputs.length; i++) {
		checkInput(inputs[i]);
	}
});
