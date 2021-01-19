﻿/* Multiple modals fix */
(function multipleModal() {
    $(document).on('show.bs.modal', '.modal', function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });

    $(document).on('hidden.bs.modal', '.modal', function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    });
})()

/* Script */
$(document).ready(function () {
    const apiUrl = "https://localhost:44381/api";
    const loadSpinner = $("#loading-spinner");
    $('#ctcForm').validate({
        rules: {
            name: { required: true }
        },
        messages: {
            name: { required: "O nome do contato é obrigatório!" }
        }
    });

    $('#pnNumber').on('keydown', function (e) {
        if (!((e.keyCode > 95 && e.keyCode < 106) //Numpad0-9
            || (e.keyCode > 47 && e.keyCode < 58) //1-9
            || e.keyCode == 8)) { //Bskp
            return false;
        }
    });

    function clearContactForm() {
        $('#ctcName').val('');
    }

    function clearPhoneForm() {
        $('#pnDDD').val('');
        $('#pnNumber').val('');
    }

    function registerModalActions() {
        $('#contactModalFormClear').click(function () {
            clearContactForm();
        });

        $('#contactModalFormSave').click(function () {
            if ($('#ctcForm').valid()) {
                const modalInputId = $('#ctcId').val();
                const url = `${apiUrl}/contact${modalInputId == 0 ? '' : `/${$('#ctcId').val()}`}`;
                $.ajax(url, {
                    method: modalInputId == 0 ? 'POST' : 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ "name": $('#ctcName').val() })
                }).done(function () {
                    loadAllContacts();
                }).fail(function () {

                });
            }
        });

        $('#phoneModalFormClear').click(function () {
            clearPhoneForm();
        });
    }

    function loadAllContacts() {
        const container = $("#contact-list");
        $.ajax(`${apiUrl}/contact`)
            .done(function (data) {
                loadSpinner.hide(0);
                if (data.lenght == 0) {
                    container.replaceWith('<strong class="text-info">Lista Vazia</strong>');
                } else {
                    container.empty()
                        .append(`<li class="list-group-item list-group-item-dark">
                                     <div class="d-flex w-100 justify-content-end">
                                         <button class="btn btn-sm btn-info" id="btn-new-ctc">Novo Contato</button>
                                     </div>
                                 </li>`);
                    data.forEach(function (contact) {
                        container.append(`<li class="list-group-item list-group-item-action">
                                              <div class="d-flex w-100 justify-content-between">
                                                  <div class="contact-item" data-id="${contact.id}">${contact.name}</div>
                                                  <div>
                                                      <button class="btn btn-sm btn-secondary btn-edit-ctc" data-id="${contact.id}">Editar</button>
                                                      <button class="btn btn-sm btn-danger btn-rem-ctc" data-id="${contact.id}">Remover</button>
                                                  </div>
                                              </div>
                                          </li>`);
                    });
                    registerContactActions();
                }
            })
            .fail(function () {
                loadSpinner.hide(0);
                container.replaceWith('<strong class="text-danger">Erro ao ler API</strong>');
            });
    }

    function loadContactToModal(id) {
        $.ajax(`${apiUrl}/contact/${id}`)
            .done(function (data) {
                $('#contactModalViewTitle').empty().append(`Contato - ${data.name}`);
                $('#contactModalViewBody').empty()
                    .append('<p>Telefones:</p>')
                    .append('<ul class="list-group">')
                    .append(`<li class="list-group-item list-group-item-dark">
                                         <div class="d-flex w-100 justify-content-end">
                                             <button class="btn btn-sm btn-info" id="btn-new-pn">Novo Telefone</button>
                                         </div>
                                     </li>`);

                data.phoneNumbers.forEach(function (phoneNumber) {
                    $('#contactModalViewBody').append(`<li class="list-group-item">
                                                           <div class="d-flex w-100 justify-content-between">
                                                               (${phoneNumber.ddd}) ${phoneNumber.number}
                                                               <div>
                                                                   <button class="btn btn-sm btn-secondary btn-edit-pn" data-id="${phoneNumber.id}">Editar</button>
                                                                   <button class="btn btn-sm btn-danger btn-rem-pn" data-id="${phoneNumber.id}">Remover</button>
                                                               </div>
                                                           </div>
                                                       </li>`);
                });
                $('#contactModalViewBody').append('</ul>')
                registerPhoneActions();
            });
    }

    function loadContactToForm(id, successCB, failCB) {
        $.ajax(`${apiUrl}/contact/${id}`)
            .done(function (data) {
                $('#ctcId').val(data.id);
                $('#ctcName').val(data.name);
                successCB();
        }).fail(failCB);
    }

    function loadPhoneNumberToForm(id, successCB, failCB) {
        $.ajax(`${apiUrl}/phonenumber/${id}`)
            .done(function (data) {
                $('#phId').val(data.id);
                $('#pnDDD').val(data.ddd);
                $('#pnNumber').val(data.number);
                successCB();
        }).fail(failCB);
    }

    function registerPhoneActions() {
        $('#btn-new-pn').click(function (e) {
            e.preventDefault();
            $('#phoneModalFormTitle').empty().append('Adicionar Número');
            $('#phId').val(0);
            clearPhoneForm();
            $('#phoneModalForm').modal('show');
        });

        $('.btn-edit-pn').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                $('#phoneModalFormTitle').empty().append('Editar Número');
                loadPhoneNumberToForm($(this).data('id'), $('#phoneModalForm').modal('show'), function () { alert("Erro ao obter número"); });
            })
        });

        $('.btn-rem-pn').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                if (confirm('Deseja Remover o número ?')) {
                    $.ajax(`${apiUrl}/phonenumber/${$(this).attr('data-id')}`, { method: 'DELETE' })
                        .done(loadAllContacts);
                }
            })
        });
    }

    function registerContactActions() {
        $('.contact-item').each(function () {
            $(this).click(function () {
                loadContactToModal($(this).attr('data-id'));
                $('#contactModalView').modal('show');
            });
        });

        $('#btn-new-ctc').click(function () {
            $('#contactModalFormTitle').empty().append('Adicionar Contato');
            $('#ctcId').val(0);
            clearContactForm();
            $('#contactModalForm').modal('show');
        });

        $('.btn-edit-ctc').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                $('#contactModalFormTitle').empty().append('Editar Contato');
                loadContactToForm($(this).data('id'), $('#contactModalForm').modal('show'), function () { alert("Erro ao obter número"); });
            })
        });

        $('.btn-rem-ctc').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                if (confirm('Deseja Remover o contato ?')) {
                    $.ajax(`${apiUrl}/contact/${$(this).attr('data-id')}`, { method: 'DELETE' })
                        .done(loadAllContacts);
                }
            })
        });
    }

    // Main
    registerModalActions();
    loadAllContacts();
});
