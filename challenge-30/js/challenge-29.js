(function(DOM, doc) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */
  const app = (function() {
    return {
      init() {
        this.setCompanyInfo();
        this.fillSelectBrand(this.getFormData().$carBrandModel.get());
        this.fillSelectYear(this.getFormData().$carYear.get());
        this.get();
        this.handlerEvent();
      },
      
      handlerEvent() {
        this.getFormData().$formCad.on('submit', this.handlerFormCad);
        this.getFormData().$carImg.on('focusout', function() {
          let url = app.getFormData().$carImg.get().value;
          if(!app.isImgUrlValid(url)) {
            this.focus();
          }
        }, true);
      },

      handlerFormCad(evt) {
        evt.preventDefault();
        app.create(app.car());
      },

      handlerErrorXHR() {
        console.log();
      },
      
      getFormData() {
        return {
          $formCad: new DOM('[data-js="formCad"]'),
          $carImg: new DOM('[data-js="carImg"]'),
          $carBrandModel: new DOM('[data-js="carBrand"]'),
          $carYear: new DOM('[data-js="carYear"]'),
          $carPlate: new DOM('[data-js="carPlate"]'),
          $carColor: new DOM('[data-js="carColor"]')
        }
      },

      car() {
        return {
          image: this.getFormData().$carImg.get().value,
          brandModel: this.getFormData().$carBrandModel.get().value,
          year: this.getFormData().$carYear.get().value,
          plate: this.getFormData().$carPlate.get().value,
          color: this.getFormData().$carColor.get().value
        }
      },

      get() {
        let xhrUrl = configApp().url().xhrUrl().base;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', xhrUrl);
        xhr.send();
        xhr.addEventListener('readystatechange', function() {
          if(this.readyState === 4 && this.status === 0) {
            app.insertDocFrag(app.createMsg('Unknown Error Occured. Server response not received...'));
          }
          if(app.isRequestOk.call(this)) {
            let resInObj = app.setElementImgInCarObj(JSON.parse(this.responseText));
            let elementOfDocFrag;
            let arrHeader = [
              'IMAGEM',
              'MARCA/MODELO',
              'ANO',
              'PLACA',
              'COR'
            ];

            if(resInObj.length === 0) {
              elementOfDocFrag = app.createMsg('Não a dados para ser mostrado!');
            } else {
              elementOfDocFrag = app.insertbtnRemove(app.createElementTable(resInObj, arrHeader), 'REMOVE');
            }
            app.insertDocFrag(app.createDocFragment(elementOfDocFrag));
          }
        })
      },

      delete(plate) {
        let xhrUrl = configApp().url().xhrUrl().base;
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', xhrUrl);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send('plate=' + plate);
        xhr.addEventListener('readystatechange', function() {
          if(this.readyState === 4 && this.status === 0) {
            app.insertDocFrag(app.createMsg('Unknown Error Occured. Server response not received...'));
          }
          if(app.isRequestOk.call(this)) {
            // receber resposta do servidor.
            // mostrar a tabela atualizada.
          }
        });
      },
      
      create(car) {
        let xhrUrl = configApp().url().xhrUrl().base;
        const xhr = new XMLHttpRequest();
        let queryStr = '';
        let carObj = this.car();

        for(let prop in carObj) {
          queryStr += prop + '=' + carObj[prop] + '&';
        }
        queryStr = queryStr.slice(0, -2);

        xhr.open('POST', xhrUrl);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(queryStr);
        xhr.addEventListener('readystatechange', function() {
          if(this.readyState === 4 && this.status === 0) {
            app.insertDocFrag(app.createMsg('Unknown Error Occured. Server response not received...'));
          }
          if(app.isRequestOk.call(this)) {
            let response = JSON.parse(this.responseText);
            if(response.message === 'success') {
              let $form = app.getFormData().$formCad.get();     
              app.insertAsNextSibling($form, 'infoMsg');
            }
          }
        });
      },

      update(plate) {},

      insertAsNextSibling(sibling, dataset) {
        if(sibling.nextElementSibling.dataset.js === dataset) {
          sibling.nextElementSibling.replaceWith(app.formMessage('Cadastrado com sucesso!'));
          app.get();
        } else {
          sibling.insertAdjacentElement('afterend', app.formMessage('Cadastrado com sucesso!'));
          app.get();
        }
      },
      
      formMessage(msg) {
        let $div = doc.createElement('div');
        let $span = doc.createElement('span');
        $div.className = 'info-msg';
        $div.dataset.js = 'infoMsg';
        $span.appendChild(doc.createTextNode(msg));
        $div.appendChild($span);
        return $div;
    },
      createMsg(msg) {
          let $div = doc.createElement('div');
          let $h1 = doc.createElement('h1');
          $div.className = 'cont-msg';
          $h1.appendChild(doc.createTextNode(msg));
          $div.appendChild($h1);
          $h1.style.margin = '5px';
          $div.style.padding = '5px';
          return $div;
      },

      requestXHR(method, url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', callback);
        xhr.open(method, url);
        xhr.send();
      },

      fillSelectBrand(select) {
        let urlBrand = configApp().url().dir().carBrand;
        let option;
        this.requestXHR('get', urlBrand, function() {
          if(app.isRequestOk.call(this)) {
            JSON.parse(this.responseText).forEach(el => {
              option = doc.createElement('option');
              option.setAttribute('value', el.name);
              option.textContent = el.name;
              select.appendChild(option);
            });
          }
        });
      },

      setCompanyInfo() {
        let $header = new DOM('[data-js="dataCompany"]');
        let urlCompany = configApp().url().dir().company;
        this.requestXHR('get', urlCompany, function() {
          if(app.isRequestOk.call(this)) {
            let objCompany = JSON.parse(this.responseText);
            $header.get()[0].textContent = objCompany.name;
            $header.get()[1].textContent = objCompany.phone
          }
        });
      },      

      isRequestOk() {
        return this.readyState === 4 && this.status === 200;
      },

      fillSelectYear(select) {
        let yearNow = new Date().getFullYear();
        let option;
        for(let year = 1971; year <= yearNow; year++) {
          option = doc.createElement('option');
          option.textContent = year;
          option.setAttribute('value', year);
          select.appendChild(option);
        }
      },

      createLineOfTable(tagName, obj) {
        let $tr = doc.createElement('tr');
        let $t;
        for(let prop in obj) {
          $t = doc.createElement(tagName);
          $t.appendChild(
            DOM.isString(obj[prop])
            ? doc.createTextNode(obj[prop])
            : obj[prop]
          );
          $tr.appendChild($t);
        }
        return $tr;
      },
      
      insertDocFrag($docfrag) {
        let $contData = new DOM('[data-js="contData"]');
        $contData.get().replaceChildren($docfrag);
      },

      createBtnRemoveCar() {
        let $btn = doc.createElement('button');
        $btn.textContent = 'X';
        $btn.addEventListener('click', function(evt) {
          evt.preventDefault();
          let linha = this.parentElement.parentElement;
          linha.remove();
        });
        return $btn;
      },

      createDocFragment($element) {
        let docfrag = doc.createDocumentFragment();
        docfrag.appendChild($element);
        return docfrag;
      },

      setElementImgInCarObj(arrOfObj) {
        let $img;
        return arrOfObj.map(function(el) {
          $img = doc.createElement('img');
          $img.src = el.image;
          el.image = $img;
          return el;
        });
      },

      insertbtnRemove($table, header) {
        let $td;
        Array.prototype.forEach.call($table.rows, function($el, index) {
          if(index === 0) {
            let $th = doc.createElement('th');
            $th.textContent = header;
            $el.appendChild($th);
            return;
          }
          $td = doc.createElement('td');
          $td.appendChild(app.createBtnRemoveCar());
          $el.appendChild($td);
        });
        return $table;
      },

      createElementTable(responseObj, headerOfTheTable) {
        let $table = doc.createElement('table');
        let $tbody = doc.createElement('tbody');
        let $thead = doc.createElement('thead');
        let $tfoot = doc.createElement('tfoot');

        $thead.appendChild(
          this.createLineOfTable('th',
            arguments.length === 1
            ? Object.keys(responseObj[0])
            : headerOfTheTable
          )
        );

        responseObj.forEach((el, index, arr) => {
          if(arr.length - 1 === index) {
            $tfoot.appendChild(this.createLineOfTable('td', el));
            return;
          }
          $tbody.insertAdjacentElement('afterbegin', this.createLineOfTable('td', el));
        });
        $table.append($thead, $tbody, $tfoot);
        return $table;
      },
      // validações:
      
      isImgUrlValid(url) {
        let regex = /\.(JPG|JPEG|GIF|PNG|WEBP|PDF)$/i;
        
        if(url.value === '') {
          console.error('URL INVÁLID: Não é permitico este campo Vázio!');
          return false;
        }

        if(!regex.test(url)) {
          console.error('URL INVÁLID: Somente imagens do tipo JPG, JPEG, GIF, PNG, WEBP e PDF!');
          return false;
        }
        console.log(ext);
        return true;
      },
      
      isPlateCarValid() {
        let $inputPlate = this.getFormData().$carPlate.get();
        let regex = /[A-Z]{3}-\d{4}/;
        return regex.test($inputPlate.value);
      }
    } 
  })();
  app.init();
})(DOM, document);
