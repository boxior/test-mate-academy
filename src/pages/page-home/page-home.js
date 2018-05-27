const init = () => {
    if (!$(".page-home").length) {
        return false;
    }

    let form = document.querySelector(".form");

    let dateTimePicker = form.querySelector("#datetimepicker");
    let arrField = Array.from(form.querySelectorAll(".form__field"));
    let btnSubmit = form.querySelector(".form__submit");
    let errorEmptyField = "This field is require";

    const getTodayDate = () => {
        return new Date();
    };

    const validate = () => {
        checkInputFields();

        setTimeout( () => {
            !ifValidate() ?
                (console.log("submit"), successValidate()) : console.log("not submit");
        }, 0 );
    };

    const ifValidate = () => {
        return arrField.some( row => row.querySelector(".error__msg"));
    };

    const successValidate = () => {
        $.magnificPopup.open({
            items: {
                src: '<div id="small-dialog" class="zoom-anim-dialog"><h1>Thanks, form sent</h1></div>', // can be a HTML string, jQuery object, or CSS selector
                type: 'inline'
            }
        });

        setEmptyAllFields();
    };

    const setEmptyAllFields = () => {
        arrField.forEach( rowParent => {
            let row = rowParent.querySelector(".form__input");
            let arrRadio = Array.from(rowParent.querySelectorAll("[type=radio]"));

            arrRadio.length ? arrRadio.forEach( radio => {
                radio.checked = false;
            } ) : false;

            row ? row.value = "" : false;
        } );
    };

    const removeError = (rowParent) => {
        let error = rowParent.querySelector(".error__msg");
        let input = rowParent.querySelector(".form__input");

        error ? error.remove() : false;
        input ? input.classList.remove("error__input") : false;
    };

    const addError = (row, rowParent, errorMsg) => {
        row.classList.add("error__input");

        let error = document.createElement("div");
        error.classList.add('error__msg');
        error.innerText = errorMsg;

        rowParent.appendChild(error);
    };

    const checkInputFields = () => {
        arrField.forEach((rowParent) => {
            removeError(rowParent);
            let row = rowParent.querySelector(".form__input");
            let arrRadio = Array.from(rowParent.querySelectorAll("[type=radio]"));

            if (row) {
                !row.value ?
                    addError(row, rowParent, errorEmptyField)
                 : false;

                row.name === "email" ? validEmail(row) ?
                    addError(row, rowParent, validEmail(row))
                 : false : false;

                row.type === "text" ? validTextField(row) ?
                    addError(row, rowParent, validTextField(row))
                 : false : false;

                row.id === "datetimepicker" ? validBirthdayField(row) ?
                    addError(row, rowParent, validBirthdayField(row))
                 : false : false;
            }

            if(arrRadio.length) {
                validRadioField(arrRadio) ?
                    addError(row, rowParent, validRadioField(arrRadio))
                 : removeError(rowParent);
            }
        });
    };

    const validEmail = (row) => {
        let errorMsg = "Email not valid, try like name.surname@gmail.com";
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !row.value.match(reg) && row.value ? errorMsg : false;
    };

    const validTextField = (text) => {
        let errorMsg = "Your text should not have ' or \"";
        const reg = /['"]/;

        return text.value.match(reg) && text.value ? errorMsg : false;
    };

    const validBirthdayField = (birthday) => {
        let errorMsg = "Not correct date, please enter date in format dd/mm/yyyy";
        const regEmpty = /[0-9]/;
        const reg = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

        return !birthday.value.match(regEmpty) && birthday.value ? errorEmptyField : !birthday.value.match(reg) && birthday.value ? errorMsg : false;
    };

    const validRadioField = (arrRadio) => {
        let errorMsg = "Choose sex";
        const isChecked = arrRadio.some( row => {
            return row.checked;
        } );

        return !isChecked ? errorMsg : false;
    };


    btnSubmit.addEventListener("click", e => {
        e.preventDefault();
        validate();
    });

    $(dateTimePicker).datetimepicker({
        format: 'd/m/Y',
        timepicker: false,
        mask: true, // '9999/19/39 29:59' - digit is the maximum possible for a cell
        maxDate: getTodayDate()
    });
};

module.exports = {
    init: init
};