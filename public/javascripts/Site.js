String.prototype.toTitleCase = function (n) {
    var s = this;
    if (1 !== n) s = s.toLowerCase();
    return s.replace(/(^|\s)[a-z]/g, function (f) { return f.toUpperCase() });
}

var tables = [];
var table_ids = [];
var loaders = [];
$(document).ready(function () {
    $('input.sw-checkbox').bootstrapSwitch({
        size: 'small',
        onText: 'Yes',
        offText: 'No',
    });
    ResizeWindows();

    $('#user_table').DataTable({
        order: [[2, 'asc']],
        columns: [
            null,
            null,
            null,
            { 'searching': false, 'ordering': false }
        ]
    });
    $('#role_table').DataTable({
        order: [[1, 'asc']],
        columns: [
            null,
            null,
            { 'searching': false, 'ordering': false }
        ]
    });
    $('.colorbox_img').colorbox(
        {
            rel: 'colorbox',
            maxWidth: '100%',
            maxHeight: '100%'
        });
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd'
    })
});

$(window).resize(ResizeWindows);

function ResizeWindows() {
    var height = window.innerHeight - 375;

    //$('#body_container').css('height', height + 'px');
}

function ShowLoader(action, id) {
    if (loaders.length == 0) {
        var title = document.title;
        title = '[Busy] ' + title;
        document.title = title;
    }
    $('#' + id).show();
    $('#' + id + '_action').html(action);
    loaders.push(id);
}
function HideLoader(id) {
    idx = loaders.indexOf(id);
    if (idx > -1) {
        loaders.splice(idx, 1);
    }
    if (loaders.length == 0) {
        var title = document.title;
        title = title.replace('[Busy] ', '');
        document.title = title;
    }
    $('#' + id).hide();
}

function ShowModalLoader(modal, action) {
    ShowLoader(action, modal + '_modal_loading');
    $('#' + modal + '_modal_content').hide();
}

function HideModalLoader(modal) {
    HideLoader(modal + '_modal_loading');
    $('#' + modal + '_modal_content').show()
}


function HandleErrors(obj) {
    errors = "";
    for (var e = 0; e < obj.Errors.length; e++) {
        errors += obj.Errors[e].Message + "\n";
    }
    return errors;
}

function CreateDynamicOption(value, text, selected) {
    var sel = ""
    if (typeof selected !== undefined && selected != undefined) {
        sel = "selected"
    }
    return "<option class='dynamic_option' value='" + value + "' " + sel + ">" + text + "</option>";
}
function CreateDynamicListOption(value, text) {
    return "<li class='dynamic_option' id='" + value + "'>" + text + "</li>";
}

function SingleDimArrayAsString(arr, delim) {
    var str = "";
    for (var f = 0; f < arr.length; f++) {
        if (str != "") {
            str += "|"
        }
        str += arr[f];
    }
    return str;
}

function PopulateDataTable(field_names, data, table_id) {
    table_id = typeof table_id !== 'undefined' ? table_id : 'de_data_table';
    var columns = [];

    for (var f = 0; f < field_names.length; f++) {
        columns.push({
            data: field_names[f],
            title: field_names[f]
        });
    }

    _DestroyDataTable(table_id);

    var de_table = $('#' + table_id).DataTable({
        "destroy": true,
        "data": data,
        "columns": columns
    });

    _AppendDataTable(de_table, table_id);
}

function _DestroyDataTable(table_id) {
    idx = arrayIndex(table_id, table_ids)
    if (idx != null) {
        tables[idx].destroy();
        tables.splice(idx, 1);
        table_ids.splice(idx, 1);
        $('#' + table_id + '_body').empty();
    }
}

function _DestroyOnlyDataTable(table_id) {
    idx = arrayIndex(table_id, table_ids)
    if (idx != null) {
        tables[idx].destroy();
        tables.splice(idx, 1);
        table_ids.splice(idx, 1);
    }
}

function _AppendDataTable(table, table_id) {
    tables.push(table);
    table_ids.push(table_id);
}

function arrayCompare(a1, a2) {
    if (a1.length != a2.length) return false;
    var length = a2.length;
    for (var i = 0; i < length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (typeof haystack[i] == 'object') {
            if (arrayCompare(haystack[i], needle)) return true;
        } else {
            if (haystack[i] == needle) return true;
        }
    }
    return false;
}

function arrayIndex(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) {
            return i;
        }
    }
    return null;
}
function addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
}

function AjaxCall(ajax_url, data, method, success_callback, error_callback) {
    $.ajax({
        type: method,
        url: ajax_url,
        data: data,
        success: success_callback,
        error: error_callback
    });
}

function GenerateAlias(obj_id, alias_id) {
    var alias = $('#' + obj_id).val().toLowerCase().replace(/ /g, '_');
    alias_field = $('#' + alias_id);
    if (alias_field.length > 0) {
        current_alias = alias_field.val();
        if (current_alias == "") {
            $('#' + alias_id).val(alias);
        }
    }
}

function ResetModal(modal) {
    $('#' + modal).find('input').each(function () {
        $(this).empty();
    });
    $('#' + modal).find('select').each(function () {
        $(this).val('');
    });
}


function SubmitForm(form_type) {
    $('#' + form_type + "_form").submit();
}

function AjaxError(msg) {
    console.log(msg);
    alert(msg);
}

function LoadAll(type)
{
    ShowLoader("Loading Case Studies...", "loader");
    AjaxCall("/ajax/study/get_all", {'type': type}, 'POST', LoadAllSuccess, AjaxError);
}

function LoadAllSuccess(obj)
{
    HideLoader("loader");
}