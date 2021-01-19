/* Multiple modals fix */
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
    const loadSpinnerMain = $("#loading-spinner-main");
    const loadSpinnerCtc = $("#loading-spinner-ctc");

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

    function resetContactModalViewState() {
        $('#contactModalViewBodyStatic').hide(0);
        $('#btn-new-pn').attr('data-contact', 0);
        $('#contactModalViewTitle').empty()
        $('#contactModalViewBody').empty();
        loadSpinnerCtc.show();
    }

    function registerModalActions() {
        $('#contactModalFormClear').click(function () {
            clearContactForm();
        });

        $('#phoneModalFormClear').click(function () {
            clearPhoneForm();
        });

        $('#contactModalFormSave').click(function () {
            if ($('#ctcForm').valid()) {
                const modalInputId = $('#ctcId').val();
                const url = `${apiUrl}/contact${modalInputId == 0 ? '' : `/${modalInputId}`}`;
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

        $('#phoneModalFormSave').click(function () {
            //if ($('#pnForm').valid()) {
            const contactId = $(this).attr('data-contact');
            if (contactId == null) return;
            const modalInputId = $('#phId').val();
            const url = `${apiUrl}/phonenumber${modalInputId == 0 ? '' : `/${modalInputId}`}`;
            $.ajax(url, {
                method: modalInputId == 0 ? 'POST' : 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    "ddd": $('#pnDDD').val(),
                    "number": $('#pnNumber').val(),
                    contactId
                })
            }).done(function () {
                //reload list
            }).fail(function () {

            });
            //}
        });

        $('#btn-new-ctc').click(function () {
            $('#contactModalFormTitle').empty().append('Adicionar Contato');
            $('#ctcId').val(0);
            clearContactForm();
            $('#contactModalForm').modal('show');
        });

        $('#btn-new-pn').click(function (e) {
            e.preventDefault();
            $('#phoneModalFormTitle').empty().append('Adicionar Número');
            $('#phoneModalFormSave').attr('data-contact', $(this).attr('data-contact'));
            $('#phId').val(0);
            clearPhoneForm();
            $('#phoneModalForm').modal('show');
        });

        $('.contact-modal-view-close').each(function () {
            $(this).click(function () { resetContactModalViewState(); });
        });
    }

    function loadAllContacts() {
        const container = $("#contact-list-content");
        $.ajax(`${apiUrl}/contact`)
            .done(function (data) {
                loadSpinnerMain.hide(0);
                container.empty();
                if (data.lenght == 0) {
                    container.replaceWith('<strong class="text-info">Lista Vazia</strong>');
                } else {
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
                loadSpinnerMain.hide(0);
                container.replaceWith('<strong class="text-danger">Erro ao ler API</strong>');
            });
    }

    function loadContactToModal(id) {
        $.ajax(`${apiUrl}/contact/${id}`)
            .done(function (data) {
                $('#contactModalViewTitle').append(`Contato - ${data.name}`);
                loadSpinnerCtc.hide(0);
                $('#btn-new-pn').attr('data-contact', id);
                $('#contactModalViewBodyStatic').show(0);
                data.phoneNumbers.forEach(function (phoneNumber) {
                    $('#contactModalViewBody').append(`<li class="list-group-item">
                                                           <div class="d-flex w-100 justify-content-between">
                                                               (${phoneNumber.ddd}) ${phoneNumber.number}
                                                               <div>
                                                                   <button class="btn btn-sm btn-secondary btn-edit-pn" data-id="${phoneNumber.id}" data-contact="${id}">Editar</button>
                                                                   <button class="btn btn-sm btn-danger btn-rem-pn" data-id="${phoneNumber.id}">Remover</button>
                                                               </div>
                                                           </div>
                                                       </li>`);
                });
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
        $('.btn-edit-pn').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                $('#phoneModalFormTitle').empty().append('Editar Número');
                loadPhoneNumberToForm($(this).attr('data-id'), $('#phoneModalForm').modal('show'), function () { alert("Erro ao obter número"); });
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

        $('.btn-edit-ctc').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                $('#contactModalFormTitle').empty().append('Editar Contato');
                loadContactToForm($(this).attr('data-id'), $('#contactModalForm').modal('show'), function () { alert("Erro ao obter número"); });
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
    $('#contactModalViewBodyStatic').hide();
    registerModalActions();
    loadAllContacts();
});
