<%--
  Created by IntelliJ IDEA.
  User: super007
  Date: 2021/8/3
  Time: 9:56
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%><!--需要引入jstl-1.2.jar包-->
<c:set var="ctx" value="${pageContext.request.contextPath}" scope="page"/><!--需要引入jstl-1.2.jar包-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>webrtc</title>
    <style>
        body{
            background: url("${ctx}/static/img/wallhaven-pkw6y3_1920x1080.png");
            background-size:100%;
        }
        #yours{
            width:300px;
            border: 1px solid #FFB800;
            position:absolute;
            top:200px;
            left:400px;
            margin-right: 100px;
        }
        #theirs{
            width:300px;
            border: 1px solid #00F7DE;
            position:absolute;
            top:200px;
            right:400px;
        }
        .btn{
            position:absolute;
            top:515px;
            right:680px;
            width: 150px;
            height: 50px;
            border: 3px solid #8D8D8D;
            border-radius: 10px;
        }
    </style>
</head>
<body>
<button onclick="createOffer()" class="btn">开始视频</button>
<video id="yours" autoplay></video>
<video id="theirs" autoplay></video>
</body>
<script type="text/javascript" src="${ctx}/static/js/jquery.min.js"></script>
<script src="${ctx}/static/js/webtrc.js"></script>
<script>
    $(function () {
        f()
    })
</script>
</html>

