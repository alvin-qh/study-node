'use strict';

function clearServerErrorMessage($element) {
	if ($element.data('parsley-server-error')) {
		$element.parsley().removeError('server-error');
		$element.removeData('parsley-server-error');
	}
}

function bindServerEvent() {
	$('form').each((n, form) => {
		const $form = $(form);
		$form.find('input,select,textarea').on('input propertychange change', (e) => {
			clearServerErrorMessage($(e.target));
		});
	});
}

function addServerErrors() {
	$('input[type=hidden].parsley-error-holder').each((n, item) => {
		const $item = $(item);
		const name = $item.data('name');
		const msg = $item.val();
		const form = $item.data('form');

		const $form = $(form);
		const $field = $form.find('*[name=' + name + ']');
		clearServerErrorMessage($field);

		$field.data('parsley-server-error', true)
			.parsley()
			.addError('server-error', {
				message: msg
			});
	});
}

module.exports = {
	parsleyServer: () => {
		bindServerEvent();
		addServerErrors();
	},
	parsleyFormGroup: $form => {
		$form.parsley({
			errorsContainer(parsleyField) {    // change parsley message display container
				const $formGroup = parsleyField.$element.closest('.form-group');
				if ($formGroup.length > 0) {
					return $formGroup;
				}
				return parsleyField;
			}
		});
		return $form;
	}
};