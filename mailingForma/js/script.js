"use strict"

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');
  form.addEventListener('submit', formSend);//Теперь за нажатие кнопки отвечает js

  async function formSend(e) {//e-mail
    e.preventDefault();

    let error = formValidate(form);//Ищет ошибки в емайл адресе

    //Для отправки формы
    let formData = new FormData(form);
    formData.append('image', formImage.files[0]);

    if (error === 0) {
      form.classList.add('_sending');//Оповести пользователя что ошибок нет
      let response = await fetch('sendmail.php', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        let result = await response.json();
        alert(result.message);
        formPreview.innerHTML = '';
        form.reset();   
        form.classList.remove('_sending');     
      } else {
          alert("Ошибка");
          form.classList.remove('_sending');
      }      
    } else {
      alert('Заполните обязательные поля')
    }
    // -//- Для отправки формы
  }

  function formValidate(form) {
    let error = 0;
    let formReg = document.querySelectorAll('._reg');//Поле обязательного заполнения

    for (let index = 0; index < formReg.length; index++) {
      const input = formReg[index];
      formRemoveError(input);

      if (input.classList.contains('_email')) {//Ставим в само поле емайл адреса(.form__input) Всем инпутам .form__input._error css Цвет ошибки
        if (emailTest(input)) {
          formAddError(input);
          error++;
        }
      }else if (input.getAttribute("type") === "checkbox" && input.checked === false) {//.checkbox._error .checkbox__label:before css Цвет ошибки
        formAddError(input);
          error++;
      } else {
        if (input.value === '') {
          formAddError(input);
          error++;
        }
      }
    }
    return error;
  }
  //Вспомогательные функции
  function formAddError(input) {//Добавляет
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
  }
  function formRemoveError(input) {//Удаляет
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
  }
  //Функция теста email, проверяем правильность написания емайл адреса
  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\]w+)*(\.\w{2,8})+$/.test(input.value);
  }

  //Получаем инпут file(css class="file__preview") в переменную
  const formImage = document.getElementById('formImage');
  //Получаем див для превью в переменную
  const formPreview = document.getElementById('formPreview');

  //Слушаем изменения в инпуте file(css class="file__preview")
  formImage.addEventListener('change', () => {
    uploadFile(formImage.files[0]);
  });
  
  function uploadFile(file) {
    //Проверяем тип файла
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Разрешены только изображения.');
      formImage.value = '';
      return;
    }
    //Проверим размер файла (<2 Mb)
    if (file.size > 700 * 1024 * 1024) {
      alert('Файл должен быть менее 700 Mb.');
      return;
    }

    //Покажет пользователю его картинку которую он отправляет
    var reader = new FileReader();
    reader.onload = function (e) {
      formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
    };
    reader.onerror = function (e) {
      alert('Ошибка');
    };
    reader.readAsDataURL(file);
  }
});