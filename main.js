//connec
const socket = io('https://webrtcvh.herokuapp.com');

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arrUser => 
{
    $('#div-chat').show(1);
    $('#div-dky').hide();

    arrUser.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);

    });

    socket.on('MOT_NGUOI_DA_THOAT',peerId=>{
        $(`#${peerId}`).remove();
    })
});

socket.on('DANG_KY_THAT_BAI',()=>alert('User da co'))


//play video tren giao dien
//B1:open stream
function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream().then(stream => playStream('localStream',stream));

const peer = new Peer({ key: '9bebe9jlgn6zuxr' });

peer.on('open', id => {
    $("#my-peer").append(id);
    $('#btnSignup').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DKI', { ten: username, peerId: id });
    });
});

$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});


$('#ulUser').on('click','li',function(){
    const id =$(this).attr('id');
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});