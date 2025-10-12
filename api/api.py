# -*- coding: utf-8 -*-
from typing import *
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from flask import *
from flask_sock import *
import pymysql as sql
import json
import string as s
import random as r
import smtplib
import datetime
from email.mime.text import MIMEText
from email.header import Header
from flask_cors import CORS

app = Flask(__name__)
sock = Sock(app)
CORS(app, origin=["127.0.0.1", "www.jimjcy.top", "test.jimjcy.top"])
"""mysql = sql.connect(host='jimjcy.top', port=3306, user='root', password='123456', database='python_mysql_data',
                    charset='utf8mb4')"""
email_code = ""


def execute_mysql_commands(
    command: str, params=None, commit=False
) -> Union[str, tuple]:
    if params is None:
        params = []
    mysql = sql.connect(
        host="localhost",
        port=3306,
        user="root",
        password="123456",
        database="website_data",
        charset="utf8mb4",
    )
    cursor = mysql.cursor()
    cursor.execute(command, params)
    data = cursor.fetchall()
    cursor.close()
    if commit:
        mysql.commit()
    mysql.close()
    if not data:
        return tuple()
    return data


@app.route("/send_email", methods=["POST"])
def send_email_api() -> Union[tuple[str, int], str]:
    global email_code
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("codesession"), str)
        assert isinstance(data.get("email"), str)
    except Exception as e:
        return str(e), 400
    send_email(data["email"])
    command = """update codes set `email_code`=%s where `session`=%s"""
    execute_mysql_commands(command, [email_code, data["codesession"]], True)
    email_code = ""
    return "ok"


def send_email(email: str) -> str:
    global email_code
    email_code = str(r.randint(10000, 99999))
    mail_host = "smtp.jimjcy.top"  # 设置服务器
    mail_user = "xiaojingjingwebsite@jimjcy.top"  # 用户名
    mail_pass = "JINGcyfs123"  # 口令
    sender = "xiaojingjingwebsite@jimjcy.top"
    receivers = [email]
    message = MIMEText(
        "您的验证码是：{}，如果您没有发送此邮件，请忽略。".format(email_code),
        "plain",
        "utf-8",
    )
    message["From"] = "xiaojingjingwebsite{}@jimjcy.top".format(
        r.randint(100000, 999999)
    )
    message["To"] = Header("您", "utf-8")
    subject = "小井井的网站验证码"
    message["Subject"] = Header(subject, "utf-8")
    smtpObj = smtplib.SMTP()
    smtpObj.connect(mail_host, 25)  # 25 为 SMTP 端口号
    smtpObj.login(mail_user, mail_pass)
    smtpObj.sendmail(sender, receivers, message.as_string())
    return "ok"


@sock.route("/ai_chatting_sock")
def ai_chatting_sock(ws: Server):
    pass


def generate_random_str(length=32) -> str:
    letters = s.ascii_letters
    return "".join(r.choice(letters) for _ in range(length))


def generate_session_with_username(username) -> str:
    session_id = generate_random_str()
    command = """select username from session_ids"""
    users = execute_mysql_commands(command)
    in_users = False
    for i in range(len(users)):
        if users[i][0] == username:
            in_users = True
    if not in_users:
        command = """select id from session_ids"""
        last_id = execute_mysql_commands(command)[-1][0]
        command = """insert into session_ids (`id`, `username`, `sessionid`, `last_login`) values (%s, %s, %s, %s);"""
        time = str(datetime.datetime.now().strftime("%Y-%m-%d"))
        execute_mysql_commands(command, [last_id + 1, username, session_id, time], True)
    else:
        command = """update `session_ids` set sessionid=%s, `last_login`=%s where username=%s"""
        execute_mysql_commands(
            command, [session_id, datetime.datetime.now(), username], True
        )
    return session_id


@app.route("/generate_token", methods=["POST"])
def generate_token_with_code():
    token = generate_random_str()
    command = """select id from codes"""
    id = execute_mysql_commands(command)[-1][0] + 1
    command = """insert into codes (`id`, `code`, `email_code`, `session`) values (%s, 0, 0, %s)"""
    execute_mysql_commands(command, [id, token], True)
    return token


def validate_picture() -> Tuple[bool, str]:
    total = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345789"
    # 图片大小130 x 50
    width = 150
    heighth = 30
    # 先生成一个新图片对象
    im = Image.new("RGB", (width, heighth), "white")
    # 设置字体
    font = ImageFont.truetype("./Arial.ttf", 30)
    # 创建draw对象
    draw = ImageDraw.Draw(im)
    str = ""
    # 输出每一个文字
    for item in range(4):
        text = r.choice(total)
        str += text
        draw.text(
            (r.randint(1, 20) + item * 30, r.randint(-5, 0)),
            text=text,
            fill="black",
            font=font,
        )

    # 划几根干扰线
    for num in range(4):
        x1 = r.randint(0, width / 2)
        y1 = r.randint(0, heighth / 2)
        x2 = r.randint(0, width)
        y2 = r.randint(heighth / 2, heighth)
        draw.line(
            ((x1, y1), (x2, y2)),
            fill=r.choice(
                ["red", "orange", "yellow", "green", "blue", "purple", "white"]
            ),
            width=1,
        )

    # 加上滤镜
    im = im.filter(ImageFilter.FIND_EDGES)
    return im, str


# 生成验证码实例的函数
@app.route("/get_image", methods=["POST"])
def get_image() -> Union[Tuple[str, int], str]:
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("codesession"), str)
    except Exception as e:
        return str(e), 400

    # 生成验证码，image为验证码图片，code为验证码文本
    image, code = validate_picture()

    # 将验证码图片以二进制形式写入在内存中，防止将图片都放在文件夹中，占用大量磁盘
    buf = BytesIO()
    image.save(buf, "jpeg")
    buf_str = buf.getvalue()

    img_data = "data:image/png;base64," + str(base64.b64encode(buf_str))[1:].strip(
        "'"
    )  # 将验证码转换为base64格式

    command = """update codes set code=%s where `session`=%s"""
    execute_mysql_commands(command, [code, data["codesession"]], True)

    return img_data


@app.route("/login/check/<sessionid>", methods=["POST"])
def login_check(sessionid) -> str:
    try:
        command = """select username,last_login from session_ids where sessionid=%s;"""
        data = execute_mysql_commands(command, [sessionid])
        if data == "":
            return json.dumps({"ok": False})
        username, last_login = data[0][0], data[0][1]
        login_ok = True
        if str(datetime.datetime.now().strftime("%Y-%m-%d")) != str(last_login):
            login_ok = False
        if not login_ok:
            command = """delete from session_ids where username=%s;"""
            execute_mysql_commands(command, [username], True)
        command = """select `group` from user_data where username=%s;"""
        group = execute_mysql_commands(command, [username])[0][0]
        command = """select `sex` from user_data where username=%s;"""
        sex = execute_mysql_commands(command, [username])[0][0]
        return json.dumps(
            {"ok": login_ok, "username": username, "group": group, "sex": sex}
        )
    except Exception as e:
        return json.dumps({"ok": False})


@app.route("/register", methods=["POST"])
def register():
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("email"), str)
        assert isinstance(data.get("username"), str)
        assert isinstance(data.get("password"), str)
        assert isinstance(data.get("ok_password"), str)
        assert isinstance(data.get("sex"), str)
        assert isinstance(data.get("code"), str)
        assert isinstance(data.get("email_code"), str)
        assert isinstance(data.get("codesession"), str)
    except Exception as e:
        return str(e), 400
    in_users = False
    in_emails = False
    command = """select username from user_data"""
    users = execute_mysql_commands(command)
    command = """select email from user_data"""
    emails = execute_mysql_commands(command)
    command = """select code,email_code from codes where `session`=%s"""
    codes = execute_mysql_commands(command, [data["codesession"]])[0]
    code, email_code = codes[0], codes[1]
    for i in range(len(users)):
        if users[i][0] == data["username"]:
            in_users = True
    for i in range(len(emails)):
        if emails[i][0] == data["email"]:
            in_emails = True
    if data["password"] != data["ok_password"]:
        return json.dumps({"ok": False, "error_message": "密码不是一样的"})
    elif in_users:
        return json.dumps({"ok": False, "error_message": "用户已存在"})
    elif in_emails:
        return json.dumps({"ok": False, "error_message": "邮箱已使用"})
    elif data["code"].lower() != code.lower():
        return json.dumps({"ok": False, "error_message": "验证码错误"})
    elif data["email_code"] != email_code:
        return json.dumps({"ok": False, "error_message": "邮箱验证码错误"})
    else:
        command = """select id from user_data"""
        id = execute_mysql_commands(command)[-1][0] + 1
        time = str(datetime.datetime.now().strftime("%Y-%m-%d"))
        command = """insert into user_data (`id`, `username`, `password`, `email`, `group`, `register_time`, `sex`) values (%s, %s, %s, %s, %s, %s, %s)"""
        execute_mysql_commands(
            command,
            [
                id,
                data["username"],
                data["password"],
                data["email"],
                "user",
                time,
                data["sex"],
            ],
            True,
        )
        return json.dumps({"ok": True})


@app.route("/login", methods=["POST"])
def login():
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("username"), str)
        assert isinstance(data.get("password"), str)
        assert isinstance(data.get("code"), str)
        assert isinstance(data.get("codesession"), str)
    except Exception as e:
        return str(e), 400
    if "@" not in data["username"]:
        in_users = False
        command = """select username from user_data"""
        users = execute_mysql_commands(command)
        for user in users:
            if data["username"] == user[0]:
                in_users = True
                break
        if not in_users:
            return json.dumps({"ok": False, "error_message": "用户不存在"})
        command = """select password from user_data where username=%s;"""
        password = execute_mysql_commands(command, [data["username"]])[0][0]
        command = """select code from codes where session=%s"""
        code = execute_mysql_commands(command, [data["codesession"]])[0][0]
        if data["password"] != password:
            return json.dumps({"ok": False, "error_message": "密码错误"})
        elif code.lower() != data["code"].lower():
            return json.dumps({"ok": False, "error_message": "验证码错误"})
        else:
            sessionid = generate_session_with_username(data["username"])
            return json.dumps({"ok": True, "data": sessionid})
    else:
        in_emails = False
        command = """select email from user_data"""
        emails = execute_mysql_commands(command)
        for email in emails:
            if data["username"] == email[0]:
                in_emails = True
                break
        if not in_emails:
            return json.dumps({"ok": False, "error_message": "用户（邮箱）不存在"})
        command = """select password from user_data where email=%s;"""
        password = execute_mysql_commands(command, [data["username"]])[0][0]
        command = """select code from codes where session=%s"""
        code = execute_mysql_commands(command, [data["codesession"]])[0][0]
        if data["password"] != password:
            return json.dumps({"ok": False, "error_message": "密码错误"})
        elif code.lower() != data["code"].lower():
            return json.dumps({"ok": False, "error_message": "验证码错误"})
        else:
            command = """select username from user_data where email=%s"""
            username = execute_mysql_commands(command, [data["username"]])[0][0]
            sessionid = generate_session_with_username(username)
            return json.dumps({"ok": True, "data": sessionid})


@app.route("/forget_password", methods=["POST"])
def forget_password():
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("email"), str)
        assert isinstance(data.get("password"), str)
        assert isinstance(data.get("code"), str)
        assert isinstance(data.get("email_code"), str)
        assert isinstance(data.get("codesession"), str)
    except Exception as e:
        return str(e), 400
    command = """select email from user_data"""
    emails = execute_mysql_commands(command)
    in_emails = False
    for email in emails:
        if data["email"] == email[0]:
            in_emails = True
    command = """select code,email_code from codes where `session`=%s"""
    codes = execute_mysql_commands(command, [data["codesession"]])[0]
    code, email_code = codes[0], codes[1]
    if not in_emails:
        return json.dumps({"ok": False, "error_message": "用户（邮箱）不存在"})
    elif code.lower() != data["code"].lower():
        return json.dumps({"ok": False, "error_message": "验证码错误"})
    elif email_code != data["email_code"]:
        return json.dumps({"ok": False, "error_message": "邮箱验证码错误"})
    else:
        command = """update user_data set password=%s where email=%s"""
        execute_mysql_commands(command, [data["password"], data["email"]], True)
        return json.dumps({"ok": True})


@app.route("/reset_username", methods=["POST"])
def reset_username():
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("username"), str)
        assert isinstance(data.get("code"), str)
        assert isinstance(data.get("session"), str)
        assert isinstance(data.get("codesession"), str)
    except Exception as e:
        return str(e), 400
    command = """select `code` from `codes` where `session`=%s"""
    code = execute_mysql_commands(command, [data["codesession"]])[0][0]
    if code.lower() != data["code"].lower():
        return json.dumps({"ok": False, "error_message": "验证码错误"})
    else:
        command = """select `username` from `session_ids` where `sessionid`=%s"""
        username = execute_mysql_commands(command, [data["session"]])[0][0]
        command = """update `user_data` set `username`=%s where `username`=%s"""
        execute_mysql_commands(command, [data["username"], username], True)
        command = """delete from `session_ids` where `sessionid`=%s"""
        execute_mysql_commands(command, [data["session"]], True)
        return json.dumps({"ok": True})


@app.route("/reset_sex", methods=["POST"])
def reset_sex():
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("sex"), str)
        assert isinstance(data.get("code"), str)
        assert isinstance(data.get("session"), str)
        assert isinstance(data.get("codesession"), str)
    except Exception as e:
        return str(e), 400
    command = """select `code` from `codes` where `session`=%s"""
    code = execute_mysql_commands(command, [data["codesession"]])[0][0]
    if code.lower() != data["code"].lower():
        return json.dumps({"ok": False, "error_message": "验证码错误"})
    else:
        command = """select `username` from `session_ids` where `sessionid`=%s"""
        username = execute_mysql_commands(command, [data["session"]])[0][0]
        command = """update `user_data` set `sex`=%s where `username`=%s"""
        execute_mysql_commands(command, [data["sex"], username], True)
        return json.dumps({"ok": True})


@app.route("/reset_password", methods=["POST"])
def reset_password():
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("password_before"), str)
        assert isinstance(data.get("password_new"), str)
        assert isinstance(data.get("code"), str)
        assert isinstance(data.get("session"), str)
        assert isinstance(data.get("codesession"), str)
    except Exception as e:
        return str(e), 400
    command = """select `code` from `codes` where `session`=%s"""
    code = execute_mysql_commands(command, [data["codesession"]])[0][0]
    if code.lower() != data["code"].lower():
        return json.dumps({"ok": False, "error_message": "验证码错误"})
    else:
        command = """select `username` from `session_ids` where `sessionid`=%s"""
        username = execute_mysql_commands(command, [data["session"]])[0][0]
        command = """select `password` from `user_data` where `username`=%s"""
        password = execute_mysql_commands(command, [username])[0][0]
        if password != data["password_before"]:
            return json.dumps({"ok": False, "error_message": "原密码错误"})
        command = """update `user_data` set `password`=%s where `username`=%s"""
        execute_mysql_commands(command, [data["password_new"], username], True)
        return json.dumps({"ok": True})


@app.route("/reset_email", methods=["POST"])
def reset_email():
    data = {}
    try:
        data = dict(json.loads(request.data))
        assert isinstance(data, dict)
        assert isinstance(data.get("email"), str)
        assert isinstance(data.get("code"), str)
        assert isinstance(data.get("email_code"), str)
        assert isinstance(data.get("session"), str)
        assert isinstance(data.get("codesession"), str)
    except Exception as e:
        return str(e), 400
    command = """select `code` from `codes` where `session`=%s"""
    code = execute_mysql_commands(command, [data["codesession"]])[0][0]
    command = """select `email_code` from `codes` where `session`=%s"""
    email_code = execute_mysql_commands(command, [data["codesession"]])[0][0]
    if code.lower() != data["code"].lower():
        return json.dumps({"ok": False, "error_message": "验证码错误"})
    elif email_code != data["email_code"]:
        return json.dumps({"ok": False, "error_message": "邮箱验证码错误"})
    else:
        command = """select `username` from `session_ids` where `sessionid`=%s"""
        username = execute_mysql_commands(command, [data["session"]])[0][0]
        command = """update `user_data` set `email`=%s where `username`=%s"""
        execute_mysql_commands(command, [data["email"], username], True)
        return json.dumps({"ok": True})


# @app.route('/infomation/get', methods=['POST'])
# def get_infomation():
#     command = '''select * from infomation'''
#     infomation_data = execute_mysql_commands(command)
#     data = {}
#     for i in range(1, len(infomation_data)):
#         if str(infomation_data[i][2]) != '1000-01-01':
#             data[i] = {'id': infomation_data[i][0], 'title': infomation_data[i]
#             [1], 'date': str(infomation_data[i][2])}
#     data['length'] = len(data)
#     return json.dumps(data)
#
#
# @app.route('/infomation/delete/<sessionid>/<infomation_name>', methods=['POST'])
# def infomation_delete(sessionid, infomation_name):
#     command = '''select username from session_ids where sessionid=%s'''
#     username = execute_mysql_commands(command, [sessionid])[0][0]
#     command = '''select `group` from user_data where username=%s'''
#     group = execute_mysql_commands(command, [username])[0][0]
#     if group != 'admin':
#         return json.dumps({'ok': False})
#     else:
#         command = '''delete from infomation where title=%s'''
#         execute_mysql_commands(command, [infomation_name], True)
#         return json.dumps({'ok': True})
#
#
# @app.route('/api/infomation/add', methods=['POST'])
# def infomation_add():
#     data = {}
#     try:
#         data = dict(json.loads(request.data))
#         assert isinstance(data, dict)
#         assert isinstance(data.get('title'), str)
#         assert isinstance(data.get('content'), str)
#     except Exception as e:
#         return str(e), 400
#
#     if data['content'] == '' or data['title'] == '':
#         return json.dumps({'ok': False, 'error_message': '内容/标题为空'})
#
#     command = '''select title from infomation'''
#     titles = execute_mysql_commands(command)
#     for i in range(len(titles)):
#         if data['title'] == titles[i][0]:
#             return json.dumps({'ok': False, 'error_message': '资讯名称重复'})
#
#     command = '''select id from infomation'''
#     id = execute_mysql_commands(command)[-1][0] + 1
#     command = '''insert into infomation (id, title, date) value (%s, %s, %s)'''
#     execute_mysql_commands(command, [id, data['title'], str(
#         datetime.datetime.now().strftime('%Y-%m-%d'))], True)
#     f = open('./templates/infomation/{}.html'.format(
#         data['title']), 'w', encoding='utf-8')
#     f.write(data['content'])
#     f.close()
#     return json.dumps({'ok': True})
#
#
# @app.route('/infomation/modify', methods=['POST'])
# def infomation_modify():
#     data = {}
#     try:
#         data = dict(json.loads(request.data))
#         assert isinstance(data, dict)
#         assert isinstance(data.get('title'), str)
#         assert isinstance(data.get('content'), str)
#     except Exception as e:
#         return str(e), 400
#
#     if data['content'] == '':
#         return json.dumps({'ok': False, 'error_message': '内容为空'})
#
#     command = '''update infomation set date=%s where title=%s'''
#     execute_mysql_commands(command, [str(datetime.datetime.now().strftime('%Y-%m-%d')), data['title']], True)
#     f = open('./templates/infomation/{}.html'.format(
#         data['title']), 'w', encoding='utf-8')
#     f.write(data['content'])
#     f.close()
#     return json.dumps({'ok': True})


# @app.route('/infomation/<infomation_name>', methods=['post', 'get'])
# def read_infomation(infomation_name):
#     f = open('./templates/infomation/' +
#              infomation_name + '.html', mode='r', encoding='utf-8')
#     data = f.read()
#     f.close()
#     return data


# @app.route('/infomation/add', methods=['post', 'get'])
# def add_infomation():
#     return render_template('infomation_add.html')


# @app.route('/infomation/modify/<infomation_name>', methods=['GET', 'POST'])
# def modify_infomation(infomation_name):
#     f = open('./templates/infomation/' + infomation_name + '.html', 'r', encoding='utf-8')
#     data = f.read()
#     f.close()

# def write_a_acess(ip_address: str, method: str, route: str) -> bool:
#     command = '''select id from acesses_of_denied where ip_address=%s'''
#     is_denied = execute_mysql_commands(command, [ip_address])
#     if not is_denied:
#         pass
#     else:
#         command = '''select off_date from acesses_of_denied where ip_address=%s'''
#         off_date = execute_mysql_commands(command, [ip_address])[0][0]
#         if str(off_date) == str(datetime.datetime.now().strftime('%Y-%m-%d')):
#             command = '''delete from acesses_of_denied where ip_address=%s'''
#             execute_mysql_commands(command, [ip_address], True)
#         else:
#             return False
#     command = '''select time from acesses where ip_address=%s'''
#     time = (datetime.date(year=int(datetime.datetime.now().strftime('%Y-%m-%d').split('-')[0]), month=int(datetime.datetime.now().strftime('%Y-%m-%d').split('-')[1]), day=int(datetime.datetime.now().strftime('%Y-%m-%d').split('-')[2])), )
#     length = execute_mysql_commands(command, [ip_address]).count(time)
#     if length > 500:
#         command = '''select id from acesses_of_denied'''
#         id = execute_mysql_commands(command)[-1][0] + 1
#         command = '''insert into acesses_of_denied (id, ip_address, off_date) values (%s, %s, %s)'''
#         print(str((datetime.datetime.now() +
#               datetime.timedelta(days=+3)).strftime('%Y-%m-%d')))
#         execute_mysql_commands(command, [id, ip_address, str(
#             (datetime.datetime.now() + datetime.timedelta(days=+3)).strftime('%Y-%m-%d'))], True)
#         return False
#     command = '''select id from acesses'''
#     id = execute_mysql_commands(command)[-1][0] + 1
#     command = '''insert into acesses (id, ip_address, method, acess_route, time) values (%s, %s, %s, %s, %s)'''
#     time = str(datetime.datetime.now().strftime('%Y-%m-%d'))
#     execute_mysql_commands(
#         command, [id, ip_address, method, route, time], True)
#     return True


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=50000, threaded=True)
