"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Form, Input, DatePicker, Select, Button } from "antd"
import { sanitizeStudentData } from "../../utils/sanitize"

const AddStudentModal: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = () => {
    form.validateFields().then((values) => {
      const sanitizedData = sanitizeStudentData(values)
      // Send sanitizedData to the API here
      console.log("Sending data to API:", sanitizedData)
      setVisible(false)
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Student
      </Button>
      <Modal title="Add Student" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the student name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input the student email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input the student phone!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true, message: "Please input the student age!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="grade"
            label="Grade"
            rules={[{ required: true, message: "Please input the student grade!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please input the student subject!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parent_name"
            label="Parent Name"
            rules={[{ required: true, message: "Please input the parent name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parent_phone"
            label="Parent Phone"
            rules={[{ required: true, message: "Please input the parent phone!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parent_email"
            label="Parent Email"
            rules={[{ required: true, message: "Please input the parent email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the student address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the student status!" }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="enrollment_date"
            label="Enrollment Date"
            rules={[{ required: true, message: "Please select the enrollment date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddStudentModal
