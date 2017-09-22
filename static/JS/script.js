window.onload = function () {
  // 自动识别设备高度，并设置
  var deviceWidth = document.documentElement.clientHeight
  var body = document.getElementsByTagName('body')[0]
  var layer = document.getElementsByClassName('position-layer')[0]
  var main = document.getElementsByClassName('main-page')[0]
  if (main) {
    main.style.minHeight = deviceWidth + 'px'
  } else {
    body.style.minHeight = deviceWidth + 'px'
    layer.style.minHeight = deviceWidth + 'px'
  }
  tapEvent()
  display()
  button()
  refreshUserInfo()
  signIn()
  release()
  setTimeout(deleteItem, 1000)
}

//页面加载时列表渲染
function display() {
  var list = document.getElementById('list')
  if (!list) return false
  var whichPage = document.getElementsByTagName('h2')[0]
  var request = new XMLHttpRequest()
  request.open('GET', '/api/all', true)
  request.send(null)
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var jsonobj = JSON.parse(request.responseText)
      for (var i = 0; i < jsonobj.result.num; i++) {
        if (whichPage.innerHTML === "发布的问卷") {
          if (jsonobj.data[i].type === "question") {
            renderList(i, jsonobj)
          }
        } else if (whichPage.innerHTML === "发布的投票") {
          if (jsonobj.data[i].type === "vote") {
            renderList(i, jsonobj)
          }
        } else if (whichPage.innerHTML === "我发布的") {
          var username = jsonobj.data[i].nickname
          getUserName(i, jsonobj, username)
        }
      }
    } else {
      return false
    }
  }
  //获取当前用户名字，判断该数据是否由当前用户创建
  function getUserName(i, jsonobj, username) {
    var getName = new XMLHttpRequest()
    getName.open('GET', '/api/user/info', true)
    getName.onreadystatechange = function () {
      if (getName.readyState === 4 && request.status === 200) {
        if (JSON.parse(getName.responseText).nickname === username) {            
          renderList(i, jsonobj)
        } else {
          return false
        }
      }
    }
    getName.send(null)
  }
    //渲染列表
  function renderList(i, jsonobj) {
    var items = document.createElement('li')
    var links = document.createElement('a')
    var userRelease = document.createElement('span')
    var deadline = document.createElement('span')
    var icon = document.createElement('span')
    userRelease.setAttribute('class', 'user-release')
    if (jsonobj.data[i].type === "question") {
      userRelease.innerHTML = jsonobj.data[i].nickname + '发布的问卷'
    } else {
      userRelease.innerHTML = jsonobj.data[i].nickname + '发布的投票'
    }
    deadline.setAttribute('class', 'deadline')
    deadline.innerHTML = '（' + JSON.parse(jsonobj.data[i].data).date + '到期）'
    icon.setAttribute('class', 'icon')
    links.appendChild(userRelease)
    links.appendChild(deadline)
    links.appendChild(icon)
    links.setAttribute('href', JSON.parse(jsonobj.data[i].data).link)
    items.appendChild(links)
    items.setAttribute('id', jsonobj.data[i].id)
    list.appendChild(items)
  }
}

// 控制按钮旋转效果
function button() {
  var body = document.getElementsByTagName('body')[0]
  var main = document.getElementsByClassName('main-page')[0]
  var button = document.getElementsByClassName('button')[0]
  var question = document.getElementsByClassName('questionnaire-button')[0]
  var vote = document.getElementsByClassName('vote-button')[0]
  if (!button) return false
  button.addTapEvent(function () {
    var className = button.getAttribute('class')
    if (className === "button") {
      button.setAttribute('class', 'button rotation')
      vote.setAttribute('class', 'vote-button arise-vote-button')
      question.setAttribute('class', 'questionnaire-button arise-questionnaire-button')
      main.setAttribute('class', 'main-page blur')
      if (document.getElementsByClassName('mask')[0]) {
        return false
      } else {
        var mask = document.createElement('div')
        body.appendChild(mask)
        mask.setAttribute('class', 'mask')
      }
    } else {
      var mask = document.getElementsByClassName('mask')[0]
      button.setAttribute('class', 'button')
      vote.setAttribute('class', 'vote-button')
      question.setAttribute('class', 'questionnaire-button')
      main.setAttribute('class', 'main-page')
      body.removeChild(mask)
    }
  })
}

// tap事件
function tapEvent() {
  if (!HTMLElement.prototype.addTapEvent) {
    HTMLElement.prototype.addTapEvent = function (callback) {
      var tapStartTime = 0,
        tapEndTime = 0,
        tapTime = 500, //tap等待时间，在此事件下松开可触发方法
        tapStartClientX = 0,
        tapStartClientY = 0,
        tapEndClientX = 0,
        tapEndClientY = 0,
        tapScollHeight = 15, //水平或垂直方向移动超过15px测判定为取消（根据chrome浏览器默认的判断取消点击的移动量)
        cancleClick = false;
      this.addEventListener('touchstart', function () {
        tapStartTime = event.timeStamp;
        var touch = event.changedTouches[0];
        tapStartClientX = touch.clientX;
        tapStartClientY = touch.clientY;
        cancleClick = false;
      })
      this.addEventListener('touchmove', function () {
        var touch = event.changedTouches[0];
        tapEndClientX = touch.clientX;
        tapEndClientY = touch.clientY;
        if ((Math.abs(tapEndClientX - tapStartClientX) > tapScollHeight) || (Math.abs(tapEndClientY - tapStartClientY) > tapScollHeight)) {
          cancleClick = true;
        }
      })
      this.addEventListener('touchend', function () {
        tapEndTime = event.timeStamp;
        if (!cancleClick && (tapEndTime - tapStartTime) <= tapTime) {
          callback();
        }
      })
    }
  }
}

//签到
function signIn() {
  var signIn = document.getElementsByTagName('button')[0]
  var addOnePoint = document.getElementsByClassName('bonus-point')[0]
  if (!signIn || signIn.innerHTML !== '签到') return false
  var request = new XMLHttpRequest()
  request.open('GET', '/api/check', true)
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var jsonobj = JSON.parse(request.responseText)
      if (jsonobj.checked !== true) {
        signIn.addTapEvent(function () {
          signIn.innerHTML = '签到成功!'
          signIn.setAttribute('class', 'success')
          addOnePoint.style.display = 'block'
          request.open('POST', '/check', true)
          request.send(null)
        })
      } else {
        signIn.innerHTML = '签到成功!'
        signIn.setAttribute('class', 'success')
        addOnePoint.style.display = 'block'
        signIn.setAttribute('disabled', 'disabled')
      }
    } else {
      return false
    }
  }
  request.send(null)
}

//刷新用户信息
function refreshUserInfo() {
  if (!document.getElementById('points')) return false
  var request = new XMLHttpRequest()
  request.open('GET', '/api/user/info', true)
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var jsonobj = JSON.parse(request.responseText)
      var photo = document.getElementsByClassName('user-photo')[0]
      var name = document.getElementsByClassName('user-name')[0]
      var point = document.getElementById('points')
      photo.setAttribute('src', jsonobj.headimg)
      name.innerHTML = jsonobj.nickname
      point.innerHTML = jsonobj.points
    } else {
      return false
    }
  }
  request.send(null)
}

//发布问卷或投票
function release() {
  var release = document.getElementById('release')
  if (!release) return false
  var links = document.getElementsByTagName('textarea')[0]
  var deadline = document.getElementsByTagName('input')[0]
  var jsonData = {},
    restoreData = {}
  var jsonString
  release.addTapEvent(function () {
    var url = links.value
    var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
    if (reg.test(url)) {
      var request = new XMLHttpRequest()
      request.open('POST', '/api/new', true)
      if (release.innerHTML === "发布问卷") {
        if (links.value !== "" && deadline.value !== "") {
          jsonData.type = "question"
          restoreData.date = deadline.value
          restoreData.link = links.value
          jsonData.data = restoreData
          jsonString = JSON.stringify(jsonData)
          request.send(jsonString)
        } else {
          alert("你还没填完！")
        }
      } else {
        if (links.value !== "" && deadline.value !== "") {
          jsonData.type = "vote"
          restoreData.date = deadline.value
          restoreData.link = links.value
          jsonData.data = restoreData
          jsonString = JSON.stringify(jsonData)
          request.send(jsonString)
        } else {
          alert("你还没填完！")
        }
      }
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          var jsonobj = JSON.parse(request.responseText)
          if (jsonobj.err === 0 && release.innerHTML === "发布问卷") {
            alert('发布成功')
            window.open('questionnaire.html', '_self')
          } else if (jsonobj.err === 0 && release.innerHTML === "发布投票") {
            alert('发布成功')
            window.open('vote.html', '_self')
          } else {
            alert('发布失败!')
          }
        }
      }
    } else {
      alert('这不是有效链接')
    }
  })
}
//长按删除列表
function deleteItem() {
  var time = 0
  var list = document.getElementById('list')
  if (!list) return false
  var item = list.getElementsByTagName('li')
  var click = list.getElementsByTagName('a')
  for (var i = 0; i < click.length; i++) {
    click[i].onclick = function () {
      return false
    }
  }
  for (var i = 0; i < item.length; i++) {
    //当按住长达500ms时判断为长按，触发删除功能
    item[i].addEventListener('touchstart', function () {
        time = setTimeout(remove, 500, this)
        return false
      })
      //不足500ms判断为点击事件
    item[i].addEventListener('touchend', function () {
        clearTimeout(time)
        if (time != 0) {
          var links = this.getElementsByTagName('a')[0].getAttribute('href')
          var skip = confirm('确认前往该页面吗？')
          if (skip === true) {
            window.open(links, '_self')
          } else {
            return false
          }
        }
        return false
      })
      //如果按住过程中移动，则不触发长按
    item[i].addEventListener('touchmove', function () {
      clearTimeout(time)
      time = 0
    })
  }
  //删除
  function remove(elem) {
    time = 0
    var id = elem.getAttribute('id')
    var sure = confirm('确定删除吗？')
    if (sure) {
      var request = new XMLHttpRequest()
      request.open('DELETE', '/api/qv?id=' + id, true)
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          var jsonobj = JSON.parse(request.responseText)
          if (jsonobj.err === 0) {
            list.removeChild(elem)
            return false
          } else if (request.err === 403) {
            alert(jsonobj.msg)
          }
        } else {
          return false
        }
      }
      request.send(null)
    } else {
      return false
    }
  }
}
