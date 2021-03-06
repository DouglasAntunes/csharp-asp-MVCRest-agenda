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

    const loadSpinnerMain = $("#loading-spinner-main");
    const loadSpinnerCtc = $("#loading-spinner-ctc");

    const saveSpinnerCtc = $('#save-spinner-ctc');
    const saveSpinnerPn = $('#save-spinner-pn');

    const ctcValidator = $('#ctcForm').validate({
        rules: {
            name: { required: true }
        },
        messages: {
            name: { required: "O nome do contato é obrigatório!" }
        }
    });
    const pnValidator = $('#pnForm').validate({
        rules: {
            ddd: { required: true, minlength: 2, maxlength: 2 },
            pnumber: { required: true, minlength: 8, maxlength: 9 }
        },
        messages: {
            ddd: {
                required: "DDD é obrigatório!",
                minlength: "DDDs de 2 digitos!",
                maxlength: "DDDs de 2 digitos!"
            },
            pnumber: {
                required: "Número é obrigatório!",
                minlength: "Número de no mínimo 8 digitos!",
                maxlength: "Número de no máximo 9 digitos!"
            }
        }
    });

    $('#pnNumber').on('keydown', function (e) {
        if (!((e.keyCode > 95 && e.keyCode < 106) //Numpad0-9
            || (e.keyCode > 47 && e.keyCode < 58) //1-9
            || e.keyCode == 8)) { //Bskp
            return false;
        }
    });

    $('#input-search').keyup(function (e) {
        if (e.keyCode == 13) { //Both NumpadEnter & Normal Enter
            $('#btn-search').click();
        }
    });

    $('#btn-search').click(function () {
        const query = $('#input-search').val();
        loadContacts(query);
    });

    function clearContactForm() {
        $('#ctcName').val('');
        ctcValidator.resetForm();
    }

    function setStaticBackdropOnModal(modalSelector, isDisabled) {
        $(modalSelector).data('bs.modal')._config.backdrop = isDisabled ? 'static' : true;
        $(modalSelector).data('bs.modal')._config.keyboard = !isDisabled;
    }

    function setBtnState(selector, isDisabled) {
        if (isDisabled) {
            $(selector).attr('disabled', 'disabled');
        } else {
            $(selector).removeAttr('disabled');
        }
    }

    function setBtnStatusModal(isDisabled, modalId, spinnerVar) {
        setBtnState(`${modalId} .modal-dialog .modal-footer > button`, isDisabled);
        if (isDisabled) {
            spinnerVar.show(0);
        } else {
            spinnerVar.hide(0);
        }
    }

    function clearPhoneForm() {
        $('#pnDDD').val('');
        $('#pnNumber').val('');
        pnValidator.resetForm();
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

                setBtnStatusModal(true, '#contactModalForm', saveSpinnerCtc);
                setStaticBackdropOnModal('#contactModalForm', true);

                $.ajax(url, {
                    method: modalInputId == 0 ? 'POST' : 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ "name": $('#ctcName').val() })
                }).done(function () {
                    $('#contactModalForm').modal('hide');
                    loadContacts();
                    setStaticBackdropOnModal('#contactModalForm', false);
                    setBtnStatusModal(false, '#contactModalForm', saveSpinnerCtc);
                    
                }).fail(function () {
                    $('#ctc-error').empty().append('Erro ao salvar contato!');
                    setBtnStatusModal(false, '#contactModalForm', saveSpinnerCtc);
                    setStaticBackdropOnModal('#contactModalForm', false);
                });
            }
        });

        $('#phoneModalFormSave').click(function () {
            if ($('#pnForm').valid()) {
                const contactId = $(this).attr('data-contact');
                if (contactId == null) return;
                const modalInputId = $('#phId').val();
                const url = `${apiUrl}/phonenumber${modalInputId == 0 ? '' : `/${modalInputId}`}`;

                setBtnStatusModal(true, '#phoneModalForm', saveSpinnerPn);
                setStaticBackdropOnModal('#phoneModalForm', true);

                $.ajax(url, {
                    method: modalInputId == 0 ? 'POST' : 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "ddd": $('#pnDDD').val(),
                        "number": $('#pnNumber').val(),
                        contactId
                    })
                }).done(function () {
					$('#phoneModalForm').modal('hide');
                    loadSpinnerCtc.show(0);
                    loadContactToModal(contactId);
                    setStaticBackdropOnModal('#phoneModalForm', false);
                    setBtnStatusModal(false, '#phoneModalForm', saveSpinnerPn);
                }).fail(function () {
                    $('#pn-error').empty().append('Erro ao salvar número!');
                    setBtnStatusModal(false, '#phoneModalForm', saveSpinnerPn);
                    setStaticBackdropOnModal('#phoneModalForm', false);
                });
            }
        });

        $('#btn-new-ctc').click(function () {
            $('#contactModalFormTitle').empty().append('Adicionar Contato');
            $('#ctcId').val(0);
            clearContactForm();
            $('#ctc-error').empty();
            $('#contactModalForm').modal('show');
        });

        $('#btn-new-pn').click(function () {
            $('#phoneModalFormTitle').empty().append('Adicionar Número');
            $('#phoneModalFormSave').attr('data-contact', $(this).attr('data-contact'));
            $('#phId').val(0);
            clearPhoneForm();
            $('#pn-error').empty();
            $('#phoneModalForm').modal('show');
        });

        $('#contactModalView').on('hidden.bs.modal', function () {
            resetContactModalViewState();
        });
    }

    function loadContacts(query = '') {
        const container = $("#contact-list-content");
        const endpointUrl = `${apiUrl}/contact${query.length > 0 ? `/find/${query}` : ''}`;
        $.ajax(endpointUrl)
            .done(function (data) {
                loadSpinnerMain.hide(0);
                container.empty();
                if (data.length == 0) {
                    const emptyMsg = query.length > 0 ?
                        `Não há resultados para contatos com nome contendo "${query}".`
                        : 'Não há contatos cadastrados. Crie contatos no botão "Novo Contato".';
                    container.append(`<li class="list-group-item">
                                          <strong class="d-flex w-100 justify-content-center text-info">${emptyMsg}</strong>
                                      </li>`);
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
                $('#ctc-top-bar').hide(0);
                container.replaceWith('<strong class="text-danger">Erro ao ler API</strong>');
            });
    }

    function loadContactToModal(id, callbackCB, failCB) {
        $.ajax(`${apiUrl}/contact/${id}`)
            .done(function (data) {
                $('#contactModalViewBody').empty();
                $('#contactModalViewTitle').empty().append(`Contato - ${data.name}`);
                loadSpinnerCtc.hide(0);
                $('#btn-new-pn').attr('data-contact', id);
                $('#contactModalViewBodyStatic').show(0);
                data.phoneNumbers.forEach(function (phoneNumber) {
                    $('#contactModalViewBody').append(`<li class="list-group-item">
                                                           <div class="d-flex w-100 justify-content-between">
                                                               (${phoneNumber.ddd}) ${phoneNumber.number}
                                                               <div>
                                                                   <button class="btn btn-sm btn-secondary btn-edit-pn" data-id="${phoneNumber.id}" data-contact="${id}">Editar</button>
                                                                   <button class="btn btn-sm btn-danger btn-rem-pn" data-id="${phoneNumber.id}" data-contact="${id}">Remover</button>
                                                               </div>
                                                           </div>
                                                       </li>`);
                });
                registerPhoneActions();
                callbackCB();
            }).fail(failCB);
    }

    function loadContactToForm(id, successCB, failCB) {
        $.ajax(`${apiUrl}/contact/${id}`)
            .done(function (data) {
                $('#ctc-error').empty()
                $('#ctcId').val(data.id);
                $('#ctcName').val(data.name);
                successCB();
        }).fail(failCB);
    }

    function loadPhoneNumberToForm(id, successCB, failCB) {
        $.ajax(`${apiUrl}/phonenumber/${id}`)
            .done(function (data) {
                $('#pn-error').empty()
                $('#phId').val(data.id);
                $('#pnDDD').val(data.ddd);
                $('#pnNumber').val(data.number);
                successCB();
        }).fail(failCB);
    }

    function registerPhoneActions() {
        $('.btn-edit-pn').each(function () {
            $(this).click(function () {
                pnValidator.resetForm();

                const ctcId = $(this).attr('data-contact');
                $('#phoneModalFormSave').attr('data-contact', ctcId);
                $('#phoneModalFormTitle').empty().append('Editar Número');
                loadPhoneNumberToForm($(this).attr('data-id'),
                    function () { $('#phoneModalForm').modal('show'); },
                    function () { alert("Erro ao obter número"); });
            });
        });

        $('.btn-rem-pn').each(function () {
            $(this).click(function () {
                if (confirm('Deseja Remover o número ?')) {
                    const ctcId = $(this).attr('data-contact');
                    $.ajax(`${apiUrl}/phonenumber/${$(this).attr('data-id')}`, { method: 'DELETE' })
                        .done(function () {
                            loadContactToModal(ctcId, null, function () {
                                alert("Erro ao obter dados do contato");
                            });
                        }).fail(function () { alert("Erro ao remover número do contato"); });
                }
            });
        });
    }

    function registerContactActions() {
        $('.contact-item').each(function () {
            $(this).click(function () {
                loadContactToModal($(this).attr('data-id'),
                    function () { $('#contactModalView').modal('show'); },
                    function () { alert("Erro ao obter dados do contato"); });
                
            });
        });

        $('.btn-edit-ctc').each(function () {
            $(this).click(function () {
                ctcValidator.resetForm();

                $('#contactModalFormTitle').empty().append('Editar Contato');
                loadContactToForm($(this).attr('data-id'),
                    function () { $('#contactModalForm').modal('show'); },
                    function () { alert("Erro ao obter dados do contato"); });
            });
        });

        $('.btn-rem-ctc').each(function () {
            $(this).click(function () {
                if (confirm('Deseja Remover o contato ?')) {
                    $.ajax(`${apiUrl}/contact/${$(this).attr('data-id')}`, { method: 'DELETE' })
                        .done(loadContacts)
                        .fail(function () { alert("Erro ao remover contato"); });
                }
            });
        });
    }

    // Main
    $('#contactModalViewBodyStatic').hide();
    saveSpinnerCtc.hide();
    saveSpinnerPn.hide();
    registerModalActions();
    loadContacts();
});
